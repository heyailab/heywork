/**
 * 【逆向还原】由 `lib/index.js` 的 `//#region lib/types/ssh-target.js` 反推，非 DeepSeek 原始源码。
 *
 * 长度上限 320、两条正则、端口范围 1..65535、IPv6 由 `new URL` 验证、域名逐标签校验，
 * 以及 `if (...) try/catch else if (...)` 的控制流均与 lib 逐行一致，未作"健壮性"改动。
 * 运行时仍以 lib/*.js 为准，详见 src/README.md。
 */

/** parseUmaSshTarget 返回的已校验目的地。 */
export interface UmaSshTarget {
  user: string
  host: string
  port: number
}

/**
* Parse a destination without accepting passwords, shell syntax or SSH options.
* @param input - A login destination, SSH URL or common ssh command.
* @returns The validated destination, or undefined for unsupported input.
*/
export function parseUmaSshTarget(input: string): UmaSshTarget | undefined {
  let value = input.trim();
  let commandPort: string | undefined;
  if (value.length > 320) return void 0;
  if (value.startsWith("ssh ")) {
    const command = /^ssh\s+(?:-p\s+(\d{1,5})\s+)?(\S+)(?:\s+-p\s+(\d{1,5}))?$/u.exec(value);
    if (command?.[2] === void 0 || command[1] !== void 0 && command[3] !== void 0) return void 0;
    value = command[2];
    commandPort = command[1] ?? command[3];
  }
  const address = /^(?:ssh:\/\/)?([A-Za-z_][A-Za-z0-9_.-]{0,63})@(\[[a-fA-F0-9:.]+\]|[A-Za-z0-9][A-Za-z0-9.-]{0,252})(?::(\d{1,5}))?$/u.exec(value);
  if (address?.[1] === void 0 || address[2] === void 0 || commandPort !== void 0 && address[3] !== void 0) return void 0;
  const port = Number(commandPort ?? address[3] ?? "22");
  if (port < 1 || port > 65535) return void 0;
  const host = address[2];
  if (host.startsWith("[")) try {
    new URL(`ssh://${host}`);
  }
  catch (_error) {
    return;
  }
  else if (!host.replace(/\.$/u, "").split(".").every((label) => /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/u.test(label))) return void 0;
  return {
    user: address[1],
    host: host.startsWith("[") ? host.slice(1, -1) : host,
    port
  };
}

/**
* Format a validated destination for the SSH URI handler.
* @param target - A parsed SSH destination.
* @returns The URI with explicit login, host and port.
*/
export function umaSshUri(target: UmaSshTarget): string {
  return `ssh://${target.user}@${target.host.includes(":") ? `[${target.host}]` : target.host}:${target.port}`;
}
