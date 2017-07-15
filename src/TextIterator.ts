export default class TextIterator {
    private cursor: number = 0;
    private chunk: string = "";
    private line: number = 1;
    private ch: number = 1;
    private sliceBegin: number = 0;

    public feedChunk(chunk: string): void {
        if (this.hasNext()) {
            throw new Error(
                "A new chunk appeared before the previous one was finished"
            );
        }
        this.cursor = 0;
        this.chunk = chunk;
    }

    public markSliceBegin(): void {
        this.sliceBegin = this.cursor;
    }

    public getSlice(): string {
        return this.chunk.substring(this.sliceBegin, this.cursor);
    }

    public nextChar(): string {
        if (!this.hasNext()) {
            throw new Error('Illegal state: iterator cannot move forward!');
        }
        this.cursor++;
        this.ch++;
        const c = this.chunk.charAt(this.cursor);
        if (c === "\n") {
            this.ch = 1;
            this.line++;
        }
        return c;
    }

    public currentChar(): string {
        return this.chunk.charAt(this.cursor);
    }

    public currentCharCode(): number {
        return this.currentChar().charCodeAt(0);
    }

    public nextCharCode(): number {
        return this.nextChar().charCodeAt(0);
    }

    public hasNext(): boolean {
        return this.cursor < this.chunk.length;
    }

    public getLine(): number {
        return this.line;
    }

    public getCh(): number {
        return this.ch;
    }
}
