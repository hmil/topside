import { Context, Fragment, Rule, RuleBook } from "./CompilerInterface";
import CompileError from "./CompileError";
import { AtRuleToken, TextToken, Token } from "./Token";
import Tokenizer from "./Tokenizer";

export interface CompilerOptions {
    file?: string
};

export default class Compiler {
    private fragmentsBefore: Fragment[] = [];
    private fragmentsAfter: Fragment[] = [];

    constructor(private rules: RuleBook) {}

    public use(rule: Rule): void {
        if (rule.name in this.rules) {
            throw new Error(
                "A rule with this name already exists: " + rule.name
            );
        }
        this.rules[rule.name] = rule;
    }

    public addFragment(position: "before" | "after", f: Fragment): void {
        if (position === "after") {
            this.fragmentsAfter.splice(0, 0, f);
        } else {
            this.fragmentsBefore.push(f);
        }
    }

    public compile(input: string, options?: CompilerOptions): string {
        try {
            const tokenizer = new Tokenizer();
            tokenizer.consume(input);
            const tokens = tokenizer.close();
            return this.processTokens(tokens);
        } catch (e) {
            if (e.name === "CompileError") {
                let file = 'anonymous';
                if (options && options.file != null) {
                    file = options.file;
                }
                console.error(this.prettyPrintError(e, input, file));
            }
            throw e;
        }
    }

    public processTokens(tokens: Token[]): string {
        const context = new Context();

        for (let i of Object.keys(this.rules)) {
            let rule = this.rules[i];
            if (rule.initContext) {
                rule.initContext(context);
            }
        }

        let fragments = tokens.map(t => {
            const rule = this.getRule(t);
            return rule.analyze(context, t);
        });

        return [...this.fragmentsBefore, ...fragments, ...this.fragmentsAfter]
            .map(t => t.render(context))
            .join("");
    }

    private prettyPrintError(e: CompileError, text: string, file: string): string {
        let i = 0;

        for (
            let line = 1;
            line < e.line && i < text.length;
            i++, line += text.charAt(i) === "\n" ? 1 : 0
        );

        let pretty = text.substr(i + 1);
        let nextNL = pretty.indexOf("\n");
        if (nextNL !== -1) {
            pretty = pretty.substr(0, nextNL);
        }

        const spacer = Array(e.ch).join(" ");
        pretty += "\n" + spacer + "^";
        pretty += "\n" + e;

        return `\n${ pretty }\n    at ${file}:${e.line}:${e.ch}\n`;
    }

    private getRule(t: Token): Rule {
        if (t.type === TextToken.type) {
            return this.rules._text;
        } else if (t.type === AtRuleToken.type) {
            if (t.ruleName === "") {
                return this.rules._default;
            } else if (t.ruleName in this.rules) {
                return this.rules[t.ruleName];
            } else {
                throw new CompileError(
                    `Invalid rule name: "${t.ruleName}"`,
                    t.line,
                    t.ch
                );
            }
        }

        throw new CompileError(
            `Unrecognized token type: ${t.type}`,
            t.line,
            t.ch
        );
    }
}
