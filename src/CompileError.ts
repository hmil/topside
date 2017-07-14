export default class CompileError extends Error {
    constructor(
        message: string,
        public readonly line: number,
        public readonly ch: number
    ) {
        super(message);
        this.name = "CompileError";
    }
}
