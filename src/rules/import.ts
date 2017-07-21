import { Context, Fragment, Rule } from "../CompilerInterface";
import NullFragment from "../fragments/null";
import { Token } from "../Token";

const SEMICOLON_RX = /;$/;

declare module "../CompilerInterface" {
    interface Context {
        imports: string[];
    }
}

export const ImportRule: Rule = {
    name: "import",

    initContext(ctx: Context): void {
        ctx.imports = [];
    },

    analyze(ctx: Context, t: Token): Fragment {
        const importExpr = t.data.trim().replace(SEMICOLON_RX, "");
        ctx.imports.push(importExpr);
        return new NullFragment(t);
    }
};
