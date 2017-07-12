import CompileError from "./CompileError";
import { AtRuleToken, TextToken, Token, TokenBuilder } from "./Token";
import TextIterator from "./TextIterator";

type TokenizerState = () => void;

const CHARCODE_a = "a".charCodeAt(0);
const CHARCODE_z = "z".charCodeAt(0);
const CHARCODE_OPEN_PAREN = "(".charCodeAt(0);
const CHARCODE_SPACE = " ".charCodeAt(0);
const CHARCODE_NL = "\n".charCodeAt(0);

export default class Tokenizer {
    private state: TokenizerState = this.state_text;
    private it: TextIterator = new TextIterator();
    private charStack: string[] = [];
    private hasOpenParen: boolean = false;
    private ended: boolean = false;
    private tokens: Token[] = [];
    private currentToken: TokenBuilder = new TextToken(1, 1);

    public consume(buf: string): void {
        this.it.feedChunk(buf.replace(/\r/g, ""));
        if (this.ended === true) {
            throw new Error("Parser already closed");
        }
        while (this.it.hasNext()) {
            this.state();
        }
    }

    public close(): Token[] {
        this.ended = true;
        if (this.currentToken.type !== TextToken.type) {
            throw new CompileError(
                "Unexpected end of file",
                this.it.getLine(),
                this.it.getCh()
            );
        }
        this.tokens.push(this.currentToken.build());
        return this.tokens;
    }

    private state_text(): void {
        this.it.markSliceBegin();
        let c = "";
        for (
            c = this.it.currentChar();
            this.it.hasNext();
            c = this.it.nextChar()
        ) {
            switch (c) {
                case "@":
                    this.currentToken.data.push(this.it.getSlice());
                    this.flushToken(
                        new AtRuleToken(this.it.getLine(), this.it.getCh())
                    );
                    this.state = this.state_atRuleBegin;
                    return;
                case "\\":
                    this.currentToken.data.push(this.it.getSlice());
                    this.state = this.state_textEscaped;
                    return;
            }
        }
        this.currentToken.data.push(this.it.getSlice());
    }

    private state_textEscaped(): void {
        this.currentToken.data.push(this.it.nextChar());
        this.state = this.state_text;
    }

    /**
     * @rule   (some data)
     * ^
     * Here
     */
    private state_atRuleBegin(): void {
        this.it.nextChar();
        this.state = this.state_atRuleName;
    }

    /**
     * @rule   (some data)
     *  ^^^^
     *  Here
     */
    private state_atRuleName(): void {
        this.it.markSliceBegin();
        let c = 0;
        for (
            c = this.it.currentCharCode();
            this.it.hasNext();
            c = this.it.nextCharCode()
        ) {
            if (c < CHARCODE_a || c > CHARCODE_z) {
                if (
                    c !== CHARCODE_NL &&
                    c !== CHARCODE_OPEN_PAREN &&
                    c !== CHARCODE_SPACE
                ) {
                    throw new CompileError(
                        'Unexpected char: "' +
                            c +
                            '"\n " ", "(" or "\n" expected',
                        this.it.getLine(),
                        this.it.getCh()
                    );
                }
                this.currentToken.ruleName.push(this.it.getSlice());
                this.state = this.state_atRuleAwaitData;
                return;
            }
        }
    }

    /**
     * @rule   (some data)
     *      ^^^
     *     Here
     */
    private state_atRuleAwaitData(): void {
        let c = "";
        for (
            c = this.it.currentChar();
            this.it.hasNext();
            c = this.it.nextChar()
        ) {
            switch (c) {
                // Ignore spaces
                case " ":
                    break;
                // Rule has no data. It ends now
                case "\n":
                    this.state = this.state_text;
                    this.flushToken(
                        new TextToken(this.it.getLine(), this.it.getCh())
                    );
                    return;
                // Rule has parenthesized data, it ends when the parenthesis is matched.
                case "(":
                    this.state = this.state_atRuleOpenParen;
                    return;
                // Rule has unparenthesized data, it ends when the line ends.
                default:
                    this.state = this.state_atRuleData;
                    return;
            }
        }
    }

    /**
     * @rule   (some() data)
     *         ^
     *        Here
     */
    private state_atRuleOpenParen(): void {
        this.hasOpenParen = true;
        this.charStack.push("(");
        this.it.nextChar();
        this.state = this.state_atRuleData;
    }

    /**
     * @rule   (some data)
     *          ^^^^^^^^^
     *             Here
     */
    private state_atRuleData(): void {
        this.it.markSliceBegin();
        let c = "";
        for (
            c = this.it.currentChar();
            this.it.hasNext();
            c = this.it.nextChar()
        ) {
            switch (c) {
                case "(":
                    if (this.hasOpenParen) {
                        this.charStack.push(c);
                    }
                    break;
                case ")":
                    if (this.hasOpenParen) {
                        let stacked = this.charStack.pop();
                        if (stacked !== "(") {
                            throw new CompileError(
                                "Unmatched parenthesis",
                                this.it.getLine(),
                                this.it.getCh()
                            );
                        }
                        if (this.charStack.length === 0) {
                            this.currentToken.data.push(this.it.getSlice());
                            this.flushToken(
                                new TextToken(
                                    this.it.getLine(),
                                    this.it.getCh()
                                )
                            );
                            this.state = this.state_atRuleEnd;
                            this.hasOpenParen = false;
                            return;
                        }
                    }
                    break;
                case "\n":
                    if (!this.hasOpenParen) {
                        this.currentToken.data.push(this.it.getSlice());
                        this.flushToken(
                            new TextToken(this.it.getLine(), this.it.getCh())
                        );
                        this.state = this.state_atRuleEnd;
                        return;
                    }
                    break;
            }
        }
        this.currentToken.data.push(this.it.getSlice());
    }

    /**
     * @rule   (some data)
     *                   ^
     *                 Here
     */
    private state_atRuleEnd(): void {
        this.it.nextChar();
        this.state = this.state_text;
    }

    private flushToken(nextToken: TokenBuilder): void {
        this.tokens.push(this.currentToken.build());
        this.currentToken = nextToken;
    }
}
