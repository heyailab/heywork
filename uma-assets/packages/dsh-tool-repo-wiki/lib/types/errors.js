/** A failed operation preserves the last committed Wiki checkpoint. */
export class WikiError extends Error {
    code;
    constructor(code, message, options) {
        super(`${code}: ${message}`, options);
        this.code = code;
        this.name = 'WikiError';
    }
}
//# sourceMappingURL=errors.js.map