import { createHash, randomUUID } from "node:crypto";
import { ToolArgsError, ToolContextUnavailableError, defineTool } from "@deepseek-ai/dsh-tools";
import { parseUmaSshTarget, redactDevelopmentText, umaSshUri } from "@deepseek-ai/dsh-util-uma-delivery";
import z from "@deepseek-ai/schemastery";
import { CommandDefinitionId } from "@deepseek-ai/dsh-commands/brand";
import { posix } from "node:path";
import { Socket } from "node:net";
import ssh2, { Client } from "ssh2";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { WebSocketServer, createWebSocketStream } from "ws";
//#region lib/types/operations-files.js
/** Bounded file operations through the credentials and lifetime of a live SSH connection. */
/** File requests share the SSH connection owner check before any SFTP channel opens. */
const operationsFileActions = [
	"files",
	"download",
	"upload",
	"mkdir",
	"rename",
	"remove"
];
/** @param action - Optional route segment.
* @returns Whether it identifies a supported SFTP operation.
*/
function isOperationsFileAction(action) {
	return operationsFileActions.some((candidate) => candidate === action);
}
function respond(response, status, payload = {}) {
	if (response.destroyed || response.headersSent) return;
	response.writeHead(status, {
		"cache-control": "no-store",
		"content-type": "application/json"
	});
	response.end(JSON.stringify(payload));
}
var TransferTooLarge = class extends Error {};
var DestinationExists = class extends Error {};
async function requireFreeDestination(sftp, path, signal) {
	try {
		await call(signal, (done) => {
			sftp.lstat(path, done);
		});
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === ssh2.utils.sftp.STATUS_CODE.NO_SUCH_FILE) return;
		throw error;
	}
	throw new DestinationExists();
}
function rejectOversize(response) {
	if (response.destroyed || response.headersSent) return;
	response.setHeader("connection", "close");
	respond(response, 413);
}
function safePath(value) {
	if (value === null || value.length === 0 || value.length > 4096 || /[\u0000-\u001f\u007f]/u.test(value)) return;
	return value;
}
function filename(value) {
	return safePath(value) !== void 0 && value !== "." && value !== ".." && !value.includes("/");
}
function details(attrs) {
	if (attrs.isDirectory()) return "directory";
	if (attrs.isFile()) return "file";
	if (attrs.isSymbolicLink()) return "link";
	return "other";
}
function call(signal, begin) {
	signal.throwIfAborted();
	return new Promise((resolve, reject) => {
		const abort = () => {
			const reason = signal.reason;
			reject(reason instanceof Error ? reason : new Error("SFTP operation was cancelled", { cause: reason }));
		};
		signal.addEventListener("abort", abort, { once: true });
		const finish = () => {
			signal.removeEventListener("abort", abort);
		};
		try {
			begin((error, result) => {
				finish();
				if (error) reject(error);
				else resolve(result);
			});
		} catch (error) {
			finish();
			reject(error instanceof Error ? error : new Error("Unable to start SFTP operation", { cause: error }));
		}
	});
}
function effect(signal, action) {
	return call(signal, (done) => {
		action((error) => {
			done(error, void 0);
		});
	});
}
async function openSftp(connection, signal) {
	return call(signal, (done) => {
		connection.client.sftp((error, channel) => {
			if (error !== void 0) {
				done(error, channel);
				return;
			}
			if (signal.aborted) {
				channel.end();
				return;
			}
			done(void 0, channel);
		});
	});
}
async function listDirectory(sftp, remote, signal) {
	const path = await call(signal, (done) => {
		sftp.realpath(remote, done);
	});
	const handle = await call(signal, (done) => {
		sftp.opendir(path, done);
	});
	const entries = [];
	const limit = 500;
	let truncated = false;
	try {
		while (entries.length <= limit) {
			const batch = await call(signal, (done) => {
				sftp.readdir(handle, (error, rows) => {
					if (error !== void 0 && "code" in error && error.code === ssh2.utils.sftp.STATUS_CODE.EOF) done(void 0, []);
					else done(error, rows);
				});
			});
			if (batch.length === 0) break;
			for (const row of batch) if (filename(row.filename)) entries.push({
				name: row.filename,
				kind: details(row.attrs),
				size: row.attrs.size
			});
		}
		truncated = entries.length > limit;
	} finally {
		if (!signal.aborted) await effect(signal, (done) => {
			sftp.close(handle, done);
		});
	}
	return {
		path,
		entries: entries.slice(0, limit),
		truncated
	};
}
async function upload(sftp, request, path, signal, maxBytes) {
	const temporary = posix.join(posix.dirname(path), ".hey-upload-" + randomUUID());
	let bytes = 0;
	const limit = new Transform({ transform(chunk, _encoding, next) {
		bytes += chunk.byteLength;
		next(bytes > maxBytes ? new TransferTooLarge() : null, chunk);
	} });
	try {
		await pipeline(Readable.from(request.iterator({ destroyOnReturn: false }), { objectMode: false }), limit, sftp.createWriteStream(temporary, {
			flags: "wx",
			mode: 384
		}), { signal });
		await effect(signal, (done) => {
			sftp.rename(temporary, path, done);
		});
	} catch (error) {
		const cleanup = AbortSignal.timeout(1500);
		try {
			await effect(cleanup, (done) => {
				sftp.unlink(temporary, done);
			});
		} catch (_cleanupError) {}
		throw error;
	}
}
/**
* Serve a file operation for an already authenticated SSH owner.
* @param action - File operation selected by the narrow route.
* @param request - Browser request, whose upload body is streamed.
* @param response - Browser response, with no upstream exception details.
* @param url - Parsed request URL containing remote path fields.
* @param connection - Authenticated peer-owned connection.
* @param maxBytes - Configured maximum bytes per uploaded or downloaded file.
*/
async function handleOperationsFiles(action, request, response, url, connection, maxBytes) {
	const remote = safePath(url.searchParams.get("path"));
	const next = safePath(url.searchParams.get("to"));
	if (remote === void 0 || action === "rename" && next === void 0 || action !== "files" && (remote === "/" || !filename(posix.basename(remote)))) {
		respond(response, 400);
		return;
	}
	const read = action === "files" || action === "download";
	if (request.method !== (read ? "GET" : "POST")) {
		respond(response, 405);
		return;
	}
	const length = Number(request.headers["content-length"]);
	if (action === "upload" && Number.isFinite(length) && length > maxBytes) {
		rejectOversize(response);
		return;
	}
	const owner = new AbortController();
	const cancel = () => {
		owner.abort();
	};
	response.once("close", cancel);
	const signal = AbortSignal.any([
		owner.signal,
		connection.signal,
		AbortSignal.timeout(read && action !== "download" ? 15e3 : 12e4)
	]);
	let sftp;
	try {
		sftp = await openSftp(connection, signal);
		const channel = sftp;
		if (action === "files") respond(response, 200, await listDirectory(channel, remote, signal));
		else if (action === "download") {
			if (!(await call(signal, (done) => {
				channel.lstat(remote, done);
			})).isFile()) {
				respond(response, 400);
				return;
			}
			const handle = await call(signal, (done) => {
				channel.open(remote, "r", done);
			});
			try {
				const opened = await call(signal, (done) => {
					channel.fstat(handle, done);
				});
				const size = opened.size;
				if (!opened.isFile() || !Number.isSafeInteger(size) || size < 0) {
					respond(response, 400);
					return;
				}
				if (size > maxBytes) {
					respond(response, 413);
					return;
				}
				response.writeHead(200, {
					"content-type": "application/octet-stream",
					"content-length": size,
					"cache-control": "no-store, no-transform",
					"x-content-type-options": "nosniff"
				});
				if (size === 0) response.end();
				else await pipeline(channel.createReadStream(remote, {
					handle,
					autoClose: false,
					end: size - 1
				}), response, { signal });
			} finally {
				if (!signal.aborted) await effect(signal, (done) => {
					channel.close(handle, done);
				});
			}
		} else {
			switch (action) {
				case "upload":
					await requireFreeDestination(channel, remote, signal);
					await upload(channel, request, remote, signal, maxBytes);
					break;
				case "mkdir":
					await requireFreeDestination(channel, remote, signal);
					await effect(signal, (done) => {
						channel.mkdir(remote, done);
					});
					break;
				case "rename":
					if (next === void 0 || next === "/" || !filename(posix.basename(next))) {
						respond(response, 400);
						return;
					}
					await requireFreeDestination(channel, next, signal);
					await effect(signal, (done) => {
						channel.rename(remote, next, done);
					});
					break;
				case "remove": {
					const attrs = await call(signal, (done) => {
						channel.lstat(remote, done);
					});
					await effect(signal, (done) => {
						if (attrs.isDirectory()) channel.rmdir(remote, done);
						else channel.unlink(remote, done);
					});
					break;
				}
			}
			respond(response, 200);
		}
	} catch (error) {
		if (response.headersSent) response.destroy();
		else if (error instanceof TransferTooLarge) rejectOversize(response);
		else if (error instanceof DestinationExists) {
			if (action === "upload" && !response.destroyed) response.setHeader("connection", "close");
			respond(response, 409);
		} else respond(response, 502);
	} finally {
		response.off("close", cancel);
		sftp?.end();
	}
}
/** Commands available from the inspection UI. Values never include user input. */
const operationsInspections = {
	overview: [
		"export LC_ALL=C",
		"printf \"host=%s\\n\" \"$(hostname)\"",
		"printf \"system=%s\\n\" \"$(uname -sr)\"",
		"df -Pk / | awk 'NR==2 { sub(/%$/, \"\", $5); print \"rootUsed=\" $5 }'",
		"if [ \"$(uname -s)\" = Linux ]; then",
		"  awk '{ print \"load=\" $1 }' /proc/loadavg",
		"  awk '/^MemTotal:/ { print \"memoryTotalKiB=\" $2 } /^MemAvailable:/ { print \"memoryAvailableKiB=\" $2 } /^SwapTotal:/ { print \"swapTotalKiB=\" $2 } /^SwapFree:/ { print \"swapFreeKiB=\" $2 }' /proc/meminfo",
		"  read_drops() { awk -F \":\" 'NR>2 { name=$1; gsub(/ /,\"\",name); if (name!=\"lo\") { fields=$2; sub(/^ +/,\"\",fields); split(fields,v,/ +/); rx+=v[4]; tx+=v[12] } } END { print rx+tx }' /proc/net/dev; }",
		"  before=$(read_drops)",
		"  if command -v vmstat >/dev/null 2>&1; then",
		"    vmstat 1 2 | tail -n 1 | awk '$1 ~ /^[0-9]+$/ { print \"runQueue=\" $1; print \"ioWait=\" $16; print \"cpuUsed=\" (100-$15) }'",
		"  else sleep 1; fi",
		"  after=$(read_drops)",
		"  [ \"$after\" -ge \"$before\" ] && printf \"networkDrops=%s\\n\" \"$((after-before))\"",
		"fi",
		"exit 0"
	].join("\n"),
	disk: "LC_ALL=C df -h",
	processes: "LC_ALL=C ps -eo pid,ppid,user,%cpu,%mem,comm | head -n 80",
	services: "LC_ALL=C systemctl list-units --type=service --all --no-pager --no-legend --plain --full",
	logs: "LC_ALL=C journalctl --no-pager -n 80",
	containers: "if command -v docker >/dev/null; then engine=docker; else engine=podman; fi; $engine ps -a --format '{{.Names}}|{{.Status}}|{{.Image}}'"
};
/** @param value - Requested inspection name from the renderer.
* @returns Whether the request names a built-in read-only inspection.
*/
function isOperationsInspection(value) {
	return typeof value === "string" && Object.hasOwn(operationsInspections, value);
}
/**
* Construct a single, shell-safe operation after a human selects a known row and action.
* @param kind - Management surface.
* @param action - Requested service or container action.
* @param name - The selected remote unit or container name.
* @returns A fixed command, or undefined for any unsupported input.
*/
function operationsManagementCommand(kind, action, name) {
	if (action !== "start" && action !== "stop" && action !== "restart") return;
	if (typeof name !== "string") return;
	if (kind === "services" && /^[A-Za-z0-9_][A-Za-z0-9_.@:-]{0,220}[.]service$/u.test(name)) return "systemctl --no-pager -- " + action + " " + name;
	if (kind === "containers" && /^[A-Za-z0-9][A-Za-z0-9_.-]{0,220}$/u.test(name)) return "if command -v docker >/dev/null; then engine=docker; else engine=podman; fi; $engine " + action + " -- " + name;
}
//#endregion
//#region lib/types/operations-desktop.js
const path$1 = "/hey/operations/desktop";
const handshakeMs$1 = 1e4;
function reject(socket, status) {
	socket.end(`HTTP/1.1 ${status}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`);
}
function relay(websocket, channel, signal) {
	const stream = createWebSocketStream(websocket, { highWaterMark: 64 * 1024 });
	const close = () => {
		signal.removeEventListener("abort", close);
		channel.destroy();
		stream.destroy();
	};
	stream.on("error", close);
	channel.on("error", close);
	stream.once("close", close);
	channel.once("close", close);
	signal.addEventListener("abort", close, { once: true });
	if (signal.aborted) close();
	else channel.pipe(stream).pipe(channel);
}
function forward(connection, port, request, socket, head, server) {
	const stopped = new AbortController();
	const stop = () => {
		stopped.abort();
	};
	const signal = AbortSignal.any([
		connection.signal,
		stopped.signal,
		AbortSignal.timeout(handshakeMs$1)
	]);
	const cancel = () => {
		socket.off("close", stop);
		reject(socket, "502 Bad Gateway");
	};
	socket.once("close", stop);
	signal.addEventListener("abort", cancel, { once: true });
	connection.client.forwardOut("127.0.0.1", 0, "127.0.0.1", port, (error, channel) => {
		socket.off("close", stop);
		signal.removeEventListener("abort", cancel);
		if (signal.aborted || socket.destroyed) {
			if (!error) channel.destroy();
			return;
		}
		if (error) {
			reject(socket, "502 Bad Gateway");
			return;
		}
		const closePendingChannel = () => {
			channel.destroy();
		};
		const closeSocket = () => {
			socket.destroy();
		};
		socket.once("close", closePendingChannel);
		channel.on("error", closeSocket);
		server.handleUpgrade(request, socket, head, (websocket) => {
			socket.off("close", closePendingChannel);
			channel.off("error", closeSocket);
			relay(websocket, channel, connection.signal);
		});
	});
}
/**
* Mount the binary VNC transport on the product Host.
* @param ctx - Scope that owns the web listener.
* @param lookup - Find a live SSH connection owned by the authenticated peer.
*/
function mountOperationsDesktop(ctx, lookup) {
	ctx.effect(() => {
		const server = new WebSocketServer({
			noServer: true,
			maxPayload: 64 * 1024,
			perMessageDeflate: false
		});
		const active = /* @__PURE__ */ new Map();
		const unregister = ctx.webServer.registerUpgrade({
			path: path$1,
			handler(request, socket, head) {
				const admission = ctx.connection.admit(request);
				if ("rejection" in admission) {
					reject(socket, admission.rejection === 401 ? "401 Unauthorized" : "403 Forbidden");
					return;
				}
				if (!Object.is(admission.peer.principal.kind, "owner") || admission.peer.signal.aborted) {
					reject(socket, "403 Forbidden");
					return;
				}
				const address = request.socket.remoteAddress;
				if (ctx.webServer.protocol !== "https:" && address !== "127.0.0.1" && address !== "::1" && address !== "::ffff:127.0.0.1") {
					reject(socket, "403 Forbidden");
					return;
				}
				const query = new URL(request.url ?? "/", "http://localhost").searchParams;
				const id = query.get("ssh") ?? "";
				const rawPort = query.get("port") ?? "";
				const port = Number(rawPort);
				if (!/^\d{1,5}$/u.test(rawPort) || port < 1 || port > 65535) {
					reject(socket, "404 Not Found");
					return;
				}
				const connection = lookup(id, String(admission.peer.id));
				if (connection === void 0 || connection.signal.aborted) {
					reject(socket, "404 Not Found");
					return;
				}
				const previous = active.get(id);
				active.set(id, socket);
				socket.once("close", () => {
					if (active.get(id) === socket) active.delete(id);
				});
				previous?.destroy();
				forward(connection, port, request, socket, head, server);
			}
		});
		return async () => {
			unregister();
			const closing = [...active.values()].map((socket) => new Promise((resolve) => {
				socket.once("close", resolve);
				socket.destroy();
			}));
			await Promise.all([new Promise((resolve) => {
				server.close(() => {
					resolve();
				});
			}), ...closing]);
		};
	}, "HEY Operations: remote desktop transport");
}
//#endregion
//#region lib/types/operations-ssh-terminal.js
/** Authenticated SSH connections used by the embedded terminal and the delegated command tool. */
const path = "/hey/operations/ssh";
const maxBody = 128 * 1024;
const maxConnections = 8;
const handshakeMs = 15e3;
const terminalLifetimeMs = 3600 * 1e3;
function reply(response, status, body = {}) {
	if (response.headersSent || response.destroyed) return;
	response.writeHead(status, {
		"content-type": "application/json",
		"cache-control": "no-store"
	});
	response.end(JSON.stringify(body));
}
async function readBody(request) {
	const chunks = [];
	let bytes = 0;
	for await (const chunk of request) {
		const data = Buffer.from(chunk);
		bytes += data.byteLength;
		if (bytes > maxBody) throw new Error("Request too large");
		chunks.push(data);
	}
	const value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
	if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid SSH request");
	return value;
}
/** Run a separate command channel on the same authenticated SSH connection.
* @param connection - Established SSH connection.
* @param command - Command for the remote shell.
* @param signal - Channel cancellation.
* @param maxBytes - Maximum retained bytes per output stream.
* @returns Bounded output and the server-reported exit status.
*/
async function runConnectedSsh(connection, command, signal, maxBytes) {
	signal.throwIfAborted();
	return new Promise((resolve, reject) => {
		const captureBytes = maxBytes + connection.credentialLookahead;
		const sanitize = (bytes) => Buffer.from(connection.redactCredential(bytes.toString("utf8"))).subarray(0, maxBytes).toString("utf8");
		let channel;
		let exitCode;
		let stdout = Buffer.alloc(0);
		let stderr = Buffer.alloc(0);
		let truncated = false;
		const finish = () => {
			signal.removeEventListener("abort", abort);
		};
		const abort = () => {
			channel?.close();
			finish();
			const reason = signal.reason;
			reject(reason instanceof Error ? reason : new Error("SSH operation was cancelled", { cause: reason }));
		};
		signal.addEventListener("abort", abort, { once: true });
		const executed = (error, stream) => {
			if (error) {
				finish();
				reject(error);
				return;
			}
			channel = stream;
			stream.on("error", (error) => {
				finish();
				reject(error);
			});
			if (signal.aborted) {
				abort();
				return;
			}
			const append = (previous, chunk) => {
				const remaining = captureBytes - previous.byteLength;
				if (previous.byteLength + chunk.byteLength > maxBytes) truncated = true;
				return remaining === 0 ? previous : Buffer.concat([previous, chunk.subarray(0, remaining)]);
			};
			stream.on("data", (chunk) => {
				stdout = append(stdout, chunk);
			});
			stream.stderr.on("data", (chunk) => {
				stderr = append(stderr, chunk);
			});
			stream.on("exit", (code) => {
				exitCode = code;
			});
			stream.once("close", () => {
				finish();
				if (exitCode === void 0) reject(/* @__PURE__ */ new Error("SSH command channel closed without an exit status"));
				else resolve({
					exitCode,
					stdout: sanitize(stdout),
					stderr: sanitize(stderr),
					truncated
				});
			});
			stream.end();
		};
		try {
			connection.client.exec(command, executed);
		} catch (error) {
			finish();
			reject(error instanceof Error ? error : new Error("Unable to start SSH command", { cause: error }));
		}
	});
}
function options(body, fingerprint) {
	if (typeof body.destination !== "string") return void 0;
	const target = parseUmaSshTarget(body.destination);
	const expected = typeof body.fingerprint === "string" ? body.fingerprint.trim() : "";
	if (target === void 0 || expected !== "" && !/^SHA256:[A-Za-z0-9+/]{43}$/u.test(expected)) return void 0;
	const password = typeof body.password === "string" && body.password.length <= 4096 ? body.password : void 0;
	const privateKey = typeof body.privateKey === "string" && body.privateKey.length <= 64 * 1024 ? body.privateKey : void 0;
	const passphrase = typeof body.passphrase === "string" && body.passphrase.length <= 4096 ? body.passphrase : void 0;
	const agent = process.env.SSH_AUTH_SOCK;
	let authentication;
	switch (body.auth) {
		case "password":
			if (password === void 0 || password === "") return void 0;
			authentication = { password };
			break;
		case "key":
			if (privateKey === void 0 || privateKey === "") return void 0;
			authentication = {
				privateKey,
				...passphrase === void 0 ? {} : { passphrase }
			};
			break;
		case "agent":
			if (!agent) return void 0;
			authentication = { agent };
			break;
		default: return;
	}
	return {
		target,
		config: {
			username: target.user,
			host: target.host,
			port: target.port,
			...authentication,
			readyTimeout: handshakeMs,
			keepaliveInterval: 15e3,
			agentForward: false,
			hostVerifier: (key) => {
				const actual = "SHA256:" + createHash("sha256").update(key).digest("base64").replace(/=+$/u, "");
				if (actual === expected) return true;
				fingerprint(actual);
				return false;
			}
		}
	};
}
/** Publish a local authenticated terminal transport and connection lookup.
* @param ctx - Host browser transport owner.
* @param transferBytes - Maximum bytes for each file transfer.
* @returns Lookup for authenticated connections owned by the local browser.
*/
function installOperationsTerminal(ctx, transferBytes) {
	let currentConnections;
	ctx.inject(["webServer", "connection"], (scope) => {
		const connections = /* @__PURE__ */ new Map();
		mountOperationsDesktop(scope, (id, owner) => {
			const connection = connections.get(id);
			return connection?.owner === owner ? connection : void 0;
		});
		scope.effect(() => {
			const stopping = new AbortController();
			const opening = /* @__PURE__ */ new Set();
			const sockets = /* @__PURE__ */ new Map();
			const requests = /* @__PURE__ */ new Map();
			const access = scope.connection;
			const webServer = scope.webServer;
			const handle = async (request, response) => {
				const admission = access.admit(request);
				if ("rejection" in admission) {
					reply(response, admission.rejection);
					return;
				}
				const peer = admission.peer;
				if (!Object.is(peer.principal.kind, "owner")) {
					reply(response, 403);
					return;
				}
				const address = request.socket.remoteAddress;
				if (webServer.protocol !== "https:" && address !== "127.0.0.1" && address !== "::1" && address !== "::ffff:127.0.0.1") {
					reply(response, 403);
					return;
				}
				const owner = String(peer.id);
				const url = new URL(request.url ?? "/", "http://local.invalid");
				const pathname = url.pathname;
				const admissionStatus = () => stopping.signal.aborted ? 503 : peer.signal.aborted ? 401 : void 0;
				try {
					const blocked = admissionStatus();
					if (blocked !== void 0) {
						reply(response, blocked);
						return;
					}
					if (pathname === path && request.method === "POST") {
						if (connections.size + opening.size >= maxConnections) {
							reply(response, 429);
							return;
						}
						const body = await readBody(request);
						const blockedAfterRead = admissionStatus();
						if (blockedAfterRead !== void 0) {
							reply(response, blockedAfterRead);
							return;
						}
						if (connections.size + opening.size >= maxConnections) {
							reply(response, 429);
							return;
						}
						let hostFingerprint;
						const input = options(body, (value) => {
							hostFingerprint = value;
						});
						if (input === void 0) {
							reply(response, 400);
							return;
						}
						const client = new Client();
						const socket = new Socket();
						const controller = new AbortController();
						const disconnectBeforeReady = () => {
							socket.destroy();
						};
						const openingDeadline = setTimeout(disconnectBeforeReady, handshakeMs);
						openingDeadline.unref();
						opening.add(socket);
						sockets.set(socket, new Promise((resolve) => {
							socket.once("close", () => {
								sockets.delete(socket);
								resolve();
							});
						}));
						socket.on("error", () => {});
						peer.signal.addEventListener("abort", disconnectBeforeReady, { once: true });
						let terminal;
						response.once("close", disconnectBeforeReady);
						const dispose = () => {
							clearTimeout(openingDeadline);
							peer.signal.removeEventListener("abort", disconnectBeforeReady);
							opening.delete(socket);
							if (!response.writableEnded && !response.destroyed) reply(response, 502);
							if (!controller.signal.aborted) terminal?.close();
						};
						socket.once("close", dispose);
						client.on("error", () => {
							if (!response.writableEnded && !response.destroyed) reply(response, hostFingerprint === void 0 ? 502 : 409, hostFingerprint === void 0 ? {} : { fingerprint: hostFingerprint });
							dispose();
							socket.destroy();
						});
						client.once("ready", () => {
							client.shell({
								term: "xterm-256color",
								cols: 90,
								rows: 26
							}, (error, shell) => {
								if (error) {
									if (!response.destroyed && !response.writableEnded) reply(response, 502);
									socket.destroy();
									return;
								}
								if (response.destroyed || response.writableEnded || stopping.signal.aborted) {
									socket.destroy();
									return;
								}
								const id = randomUUID();
								const attachDeadline = setTimeout(() => {
									terminal?.close();
								}, handshakeMs);
								const expires = setTimeout(() => {
									terminal?.close();
								}, terminalLifetimeMs);
								attachDeadline.unref();
								expires.unref();
								const secrets = [input.config.password, input.config.passphrase].filter((value) => typeof value === "string" && value !== "").sort((a, b) => b.length - a.length);
								terminal = {
									owner,
									client,
									shell,
									target: input.target,
									signal: controller.signal,
									stream: void 0,
									credentialLookahead: Math.max(0, ...secrets.map((value) => Buffer.byteLength(value) - 1)),
									redactCredential: (output) => secrets.reduce((text, value) => text.replaceAll(value, "[redacted]"), output),
									onFirstAttach: () => {
										clearTimeout(attachDeadline);
									},
									close: () => {
										if (controller.signal.aborted) return;
										connections.delete(id);
										controller.abort();
										clearTimeout(attachDeadline);
										clearTimeout(expires);
										socket.destroy();
									}
								};
								shell.on("error", terminal.close);
								shell.once("close", terminal.close);
								clearTimeout(openingDeadline);
								opening.delete(socket);
								connections.set(id, terminal);
								response.off("close", disconnectBeforeReady);
								reply(response, 201, {
									id,
									destination: umaSshUri(input.target)
								});
							});
						});
						try {
							socket.connect(input.target.port, input.target.host);
							client.connect({
								...input.config,
								sock: socket
							});
						} catch (_error) {
							clearTimeout(openingDeadline);
							opening.delete(socket);
							response.off("close", disconnectBeforeReady);
							socket.destroy();
							reply(response, 400);
						}
						return;
					}
					const route = /^\/hey\/operations\/ssh\/([a-f0-9-]+)\/([a-z]+)$/u.exec(pathname);
					const connection = route?.[1] === void 0 ? void 0 : connections.get(route[1]);
					if (route === null || connection === void 0 || connection.owner !== owner) {
						reply(response, 404);
						return;
					}
					const action = route[2];
					if (isOperationsFileAction(action)) {
						await handleOperationsFiles(action, request, response, url, connection, transferBytes);
						return;
					}
					if (action === "output" && request.method === "GET") {
						const previous = connection.stream;
						if (previous !== void 0 && !previous.destroyed && !previous.writableEnded) {
							reply(response, 409);
							return;
						}
						connection.stream = response;
						connection.onFirstAttach();
						response.writeHead(200, {
							"content-type": "application/octet-stream",
							"cache-control": "no-store, no-transform",
							"x-content-type-options": "nosniff"
						});
						response.flushHeaders();
						const end = () => {
							response.end();
						};
						connection.signal.addEventListener("abort", end, { once: true });
						response.once("close", () => {
							connection.signal.removeEventListener("abort", end);
							if (connection.stream !== response) return;
							connection.shell.unpipe(response);
							connection.shell.pause();
							connection.stream = void 0;
						});
						connection.shell.pipe(response);
						return;
					}
					if (request.method !== "POST") {
						reply(response, 405);
						return;
					}
					if (action === "close") {
						connection.close();
						reply(response, 200);
						return;
					}
					const body = await readBody(request);
					connection.signal.throwIfAborted();
					if (action === "inspect" || action === "manage") {
						const command = action === "inspect" ? isOperationsInspection(body.kind) ? operationsInspections[body.kind] : void 0 : operationsManagementCommand(body.kind, body.action, body.name);
						if (command === void 0) {
							reply(response, 400);
							return;
						}
						const cancelled = new AbortController();
						const abort = () => {
							cancelled.abort();
						};
						response.once("close", abort);
						try {
							const result = await runConnectedSsh(connection, command, AbortSignal.any([
								connection.signal,
								cancelled.signal,
								AbortSignal.timeout(action === "inspect" ? 1e4 : 6e4)
							]), 16384);
							if (!response.destroyed) reply(response, 200, result);
						} catch (_error) {
							if (!response.destroyed) reply(response, 502);
						} finally {
							response.off("close", abort);
						}
						return;
					}
					if (action === "input" && typeof body.data === "string" && body.data.length <= 8192 && connection.shell.writableLength <= maxBody) connection.shell.write(body.data);
					else if (action === "resize" && typeof body.cols === "number" && typeof body.rows === "number" && Number.isInteger(body.cols) && Number.isInteger(body.rows) && body.cols >= 2 && body.cols <= 400 && body.rows >= 2 && body.rows <= 200) connection.shell.setWindow(body.rows, body.cols, 0, 0);
					else {
						reply(response, 400);
						return;
					}
					reply(response, 200);
				} catch (_error) {
					if (!response.writableEnded && !response.destroyed) reply(response, 400);
				}
			};
			const unregister = webServer.register({
				kind: "prefix",
				path,
				async handler(request, response) {
					const pending = handle(request, response);
					requests.set(response, pending);
					try {
						await pending;
					} finally {
						requests.delete(response);
					}
				}
			});
			currentConnections = connections;
			return async () => {
				if (currentConnections === connections) currentConnections = void 0;
				stopping.abort();
				unregister();
				for (const response of requests.keys()) response.destroy();
				await Promise.allSettled(requests.values());
				for (const connection of connections.values()) connection.close();
				for (const socket of opening) socket.destroy();
				await Promise.allSettled(sockets.values());
			};
		}, "HEY SSH: authenticated terminal route");
	});
	return (id) => {
		const connection = currentConnections?.get(id);
		return connection?.stream === void 0 ? void 0 : connection;
	};
}
//#endregion
//#region lib/types/operations-ssh.js
/** Human-delegated server access for one live conversation. */
/** HEY Host plugin identity. */
const name = "hey-operations-ssh";
/** The command registry is the human-only grant entry point. */
const inject = [
	"commands",
	"tools",
	"workspaceRegistry"
];
/** Deployment bounds for unattended commands. */
const Config = z.object({
	grantMs: z.number().step(1).min(1e3).max(864e5).default(36e5),
	timeoutMs: z.number().step(1).min(1e3).max(6e5).default(6e4),
	transferBytes: z.number().step(1).min(1024).max(134217728).default(33554432),
	outputBytes: z.number().step(1).min(256).max(32768).default(8192)
});
/** Register explicit, temporary SSH access with per-command approval.
* @param ctx - HEY Host scope.
* @param config - SSH grant and execution bounds.
*/
function apply(ctx, config) {
	const lifetime = new AbortController();
	const terminal = installOperationsTerminal(ctx, config.transferBytes);
	const grants = /* @__PURE__ */ new WeakMap();
	const active = (agent) => {
		return [...(agent === void 0 ? void 0 : grants.get(agent)) ?? []].filter(([, grant]) => !grant.signal.aborted);
	};
	const revokeAll = (agent) => {
		for (const grant of grants.get(agent)?.values() ?? []) grant.revoke();
		grants.delete(agent);
	};
	ctx.effect(() => () => {
		lifetime.abort();
	}, "hey-operations-ssh: revoke all");
	ctx.on("agent/disposed", ({ agent }) => {
		revokeAll(agent);
	});
	ctx.effect(() => ctx.commands.register({
		name: "ops-ssh",
		definitionId: CommandDefinitionId("hey/operations-ssh"),
		description: "Delegate an SSH connection to this conversation, inspect it, or revoke it",
		input: { hint: "status | disconnect" },
		recordInput: false,
		handler({ agent, rawInput, signal }) {
			signal.throwIfAborted();
			const line = rawInput.trim();
			if (line === "disconnect") {
				revokeAll(agent);
				return {
					kind: "success",
					text: "SSH access revoked for this conversation."
				};
			}
			if (line === "status") {
				const targets = active(agent).map(([, grant]) => umaSshUri(grant.connection.target));
				return {
					kind: "success",
					text: targets.length === 0 ? "No active SSH access for this conversation." : targets.join("\n")
				};
			}
			const revoked = /^revoke ([a-f0-9-]{36})$/u.exec(line)?.[1];
			if (revoked !== void 0) {
				grants.get(agent)?.get(revoked)?.revoke();
				return {
					kind: "success",
					text: "SSH access to this server was revoked."
				};
			}
			const connectionId = /^terminal ([a-f0-9-]{36})$/u.exec(line)?.[1];
			const connection = connectionId === void 0 ? void 0 : terminal(connectionId);
			if (connectionId === void 0 || connection === void 0) return {
				kind: "error",
				text: "Connect and grant access from the HEY Operations panel."
			};
			if (!ctx.workspaceRegistry.list().some((workspace) => workspace.sessionIds.includes(agent.id))) return {
				kind: "error",
				text: "Open a workspace conversation before delegating an SSH connection."
			};
			const records = grants.get(agent) ?? /* @__PURE__ */ new Map();
			grants.set(agent, records);
			records.get(connectionId)?.revoke();
			const owner = new AbortController();
			const access = AbortSignal.any([
				lifetime.signal,
				owner.signal,
				AbortSignal.timeout(config.grantMs),
				connection.signal
			]);
			const grant = {
				connection,
				modelId: randomUUID(),
				signal: access,
				revoke: () => {
					owner.abort();
				}
			};
			records.set(connectionId, grant);
			access.addEventListener("abort", () => {
				if (records.get(connectionId) === grant) records.delete(connectionId);
			}, { once: true });
			return {
				kind: "success",
				text: `SSH access delegated for this conversation: ${umaSshUri(connection.target)}. Each command requires approval.`
			};
		}
	}), "hey-operations-ssh: human commands");
	ctx.tools.register(defineTool({
		name: "hey_ssh_servers",
		description: "List live SSH servers explicitly delegated to this conversation. Use the returned connection ID when choosing a server.",
		parameters: {},
		output: {
			schema: { type: "string" },
			render: (_args, text) => [{
				type: "text",
				text
			}]
		},
		execute(_args, exec) {
			return Promise.resolve(JSON.stringify(active(exec.agent).map(([, grant]) => ({
				connection_id: grant.modelId,
				destination: umaSshUri(grant.connection.target)
			}))));
		},
		presentCall: () => ({
			card: "generic",
			title: "List delegated SSH servers",
			rawInput: {}
		})
	}), { when: ({ agent }) => active(agent).length > 0 });
	ctx.tools.register(defineTool({
		name: "hey_ssh_run",
		description: "Run a command on the SSH server explicitly delegated to this conversation. Ask for approval for the exact command. Use this tool for remote work and inspect its exit code.",
		parameters: {
			command: {
				type: "string",
				required: true,
				description: "Shell command to run on the delegated remote server."
			},
			connection_id: {
				type: "string",
				description: "Connection ID from hey_ssh_servers. Required when multiple servers are delegated."
			}
		},
		output: {
			schema: { type: "string" },
			render: (_args, text) => [{
				type: "text",
				text
			}]
		},
		async execute({ command, connection_id: selected }, exec) {
			const agent = exec.agent;
			const delegated = active(agent);
			if (selected === void 0 && delegated.length > 1) throw new ToolArgsError(["Choose one connection_id from hey_ssh_servers"]);
			const grant = selected === void 0 ? delegated[0]?.[1] : delegated.find(([, entry]) => entry.modelId === selected)?.[1];
			if (agent === void 0 || grant === void 0 || grant.signal.aborted) throw new ToolContextUnavailableError("Delegate an SSH connection from HEY Operations before executing a command");
			const workspace = ctx.workspaceRegistry.list().find((item) => item.sessionIds.includes(agent.id));
			const approval = ctx.get("approval");
			if (workspace === void 0 || approval === void 0) throw new ToolContextUnavailableError("SSH execution requires a workspace and an approval channel");
			if (command.trim() === "" || Buffer.byteLength(command) > 4096 || command.includes("\0")) throw new ToolArgsError(["Enter an SSH command of up to 4096 bytes"]);
			const signal = AbortSignal.any([exec.signal, grant.signal]);
			const target = umaSshUri(grant.connection.target);
			const outcome = await approval.request({
				agent,
				toolName: exec.name,
				callId: exec.callId,
				signal,
				reason: `Run on ${target}:\n${command}`,
				displayReason: {
					en: `Run on ${target}:\n${command}`,
					zh: `在 ${target} 执行：\n${command}`
				}
			});
			signal.throwIfAborted();
			if (outcome !== "allowed-once") throw new ToolContextUnavailableError("The SSH command was not approved");
			if (!ctx.workspaceRegistry.get(workspace.id)?.sessionIds.includes(agent.id)) throw new ToolContextUnavailableError("The SSH conversation is no longer in its original workspace");
			const processSignal = AbortSignal.any([signal, AbortSignal.timeout(config.timeoutMs)]);
			try {
				const result = await runConnectedSsh(grant.connection, command, processSignal, config.outputBytes);
				return JSON.stringify({
					...result,
					target,
					stdout: redactDevelopmentText(result.stdout),
					stderr: redactDevelopmentText(result.stderr)
				});
			} catch (error) {
				signal.throwIfAborted();
				if (error instanceof ToolContextUnavailableError) throw error;
				throw new ToolContextUnavailableError("SSH execution failed. Verify the remote state before repeating the command.", { cause: error });
			}
		},
		presentCall: () => ({
			card: "generic",
			title: "Run a command over SSH",
			rawInput: {}
		})
	}), { when: ({ agent }) => active(agent).length > 0 });
}
//#endregion
export { Config, apply, inject, name };
