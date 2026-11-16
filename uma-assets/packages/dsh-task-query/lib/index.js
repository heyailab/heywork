import { Service } from "@deepseek-ai/cordis";
import { z } from "zod";
//#region lib/types/index.js
/** Bounded current-task retrieval hints, recovered from existing logged user messages. @module */
const WINDOW = 4e3;
const stateSchema = z.object({
	task: z.string().max(WINDOW),
	latest: z.string().max(WINDOW),
	freshTurn: z.boolean()
});
const EMPTY = {
	task: "",
	latest: "",
	freshTurn: true
};
const NEW_TASK_SOURCES = new Set(["user", "schedule"]);
const TASK_SOURCES = new Set([
	"user",
	"schedule",
	"agent-message",
	"team-message"
]);
function bounded(text) {
	if (text.length <= WINDOW) return text;
	let head = WINDOW / 2;
	let tail = text.length - (WINDOW / 2 - 1);
	if (text.charCodeAt(head) >= 56320 && text.charCodeAt(head) <= 57343) head--;
	if (text.charCodeAt(tail) >= 56320 && text.charCodeAt(tail) <= 57343) tail++;
	return `${text.slice(0, head)}\n${text.slice(tail)}`;
}
function admit(state, message) {
	if (!TASK_SOURCES.has(message.source.kind)) return state;
	const text = bounded(message.content.flatMap((part) => part.type === "text" ? [part.text] : []).join("\n"));
	if (text.trim() === "") return state;
	if (!NEW_TASK_SOURCES.has(message.source.kind) && state.task !== "") return {
		...state,
		latest: text,
		freshTurn: false
	};
	return state.freshTurn || state.task === "" ? {
		task: text,
		latest: "",
		freshTurn: false
	} : {
		task: state.task,
		latest: text,
		freshTurn: false
	};
}
function fold(state, event) {
	if (event.type === "turn/start") return state.freshTurn ? state : {
		...state,
		freshTurn: true
	};
	if (event.type !== "user/message" || !TASK_SOURCES.has(event.data.source.kind)) return state;
	return admit(typeof event.surfaceOp === "object" ? EMPTY : state, event.data);
}
/** Recoverable query hints shared by code Wiki and document knowledge. */
var TaskQuery = class extends Service {
	static inject = ["sessionProjections"];
	handle;
	/**
	* Register the query owner as a normal scoped service.
	* @param ctx - Session projection registry.
	*/
	constructor(ctx) {
		super(ctx, "taskQuery");
	}
	async [Service.init]() {
		this.handle = await this.ctx.sessionProjections.register({
			key: "workspaceRetrievalQuery",
			stateVersion: 3,
			stateSchema,
			init: () => EMPTY,
			apply: fold
		});
	}
	/**
	* Preview claimed inputs before the loop commits them, or recover the latest committed task after resume.
	* @param session - exact development Session.
	* @param claimed - current pre-step user inputs; previewing never mutates persisted state.
	* @returns the bounded task/steering query, or empty before any user text exists.
	*/
	current(session, claimed) {
		if (this.handle === void 0) throw new Error("Task query projection is not ready");
		const state = claimed.reduce(admit, this.handle.stateOf(session));
		return state.latest === "" ? state.task : bounded(`${state.task}\n${state.latest}`);
	}
};
//#endregion
export { TaskQuery, TaskQuery as default };
