import CompileError from "./CompileError";
import { AtRuleToken, TextToken, Token, TokenBuilder } from "./Token";
import TextIterator from "./TextIterator";

type TokenizerState = (eof: boolean) => void;

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
        this.assertNotEnded();
        this.it.feedChunk(buf.replace(/\r/g, ""));
        while (this.it.hasNext()) {
            this.state(false);
        }
    }

    public close(): Token[] {
        this.assertNotEnded();
        this.ended = true;
        this.state(true); // Send EOF to current state for parsing
        this.tokens.push(this.currentToken.build());
        return this.tokens;
    }

    private assertNotEnded(): void {
        if (this.ended === true) {
            throw new Error("Parser already closed");
        }
    }

    private assertNotEOF(eof: boolean) {
        if (eof) {
            throw new CompileError(
                "Unexpected end of file",
                this.it.getLine(),
                this.it.getCh()
            );
        }
    }

    private state_text(eof: boolean): void {
        if (eof) return;
        this.it.markSliceBegin();
        let c = "";
        for (
            c = this.it.currentChar();
            this.it.hasNext();
            c = this.it.nextChar()
        ) {
            if (c === '@') {
                this.currentToken.data.push(this.it.getSlice());
                this.state = this.state_atRuleBegin;
                return;
            }
        }
        this.currentToken.data.push(this.it.getSlice());
    }


    /**
     * @@
     *  ^
     * Here
     */
    private state_atChar(eof: boolean): void {
        this.assertNotEOF(eof);
        this.it.nextChar();
        this.state = this.state_text;
        this.currentToken.data.push('@');
    }

    /**
     * @rule   (some data)
     * ^
     * Here
     */
    private state_atRuleBegin(eof: boolean): void {
        this.assertNotEOF(eof);
        const c = this.it.nextChar();
        if (c === '@') {
            this.state = this.state_atChar;
        } else {
            this.flushToken(
                new AtRuleToken(this.it.getLine(), this.it.getCh())
            );
            this.state = this.state_atRuleName;
        }
    }

    /**
     * @rule   (some data)
     *  ^^^^
     *  Here
     */
    private state_atRuleName(eof: boolean): void {
        if (eof) {
            // Rule with no parameter
            return;
        }
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
                            String.fromCharCode(c) +
                            '"\nexpected " ", "(" or "\\n"',
                        this.it.getLine(),
                        this.it.getCh()
                    );
                }
                this.currentToken.ruleName.push(this.it.getSlice());
                this.state = this.state_atRuleAwaitData;
                return;
            }
        }
        this.currentToken.ruleName.push(this.it.getSlice());
    }

    /**
     * @rule   (some data)
     *      ^^^
     *     Here
     */
    private state_atRuleAwaitData(eof: boolean): void {
        if (eof) {
            return;
        }
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
                    this.state = this.state_atRuleEnd;
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
    private state_atRuleOpenParen(eof: boolean): void {
        this.assertNotEOF(eof);
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
    private state_atRuleData(eof: boolean): void {
        this.assertNotEOF(eof);
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
     * 
     * @simplerule
     *            ^
     *         or here
     */
    private state_atRuleEnd(eof: boolean): void {
        this.assertNotEOF(eof);
        this.it.nextChar();
        this.state = this.state_text;
    }

    private flushToken(nextToken: TokenBuilder): void {
        this.tokens.push(this.currentToken.build());
        this.currentToken = nextToken;
    }
}
