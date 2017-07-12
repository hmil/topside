import { Context, Fragment, Rule } from "../CompilerInterface";
import NullFragment from "../fragments/null";
import CompileError from "../CompileError";
import { Token } from "../Token";

const SEMICOLON_RX = /;$/;

export interface TemplateParameter {
    name: string;
    type: string;
}

export interface ParamsContext extends Context {
    params: TemplateParameter[];
}

export const ParamRule: Rule = {
    name: "param",

    initContext(ctx: ParamsContext): void {
        ctx.params = [];
    },

    analyze(ctx: ParamsContext, t: Token): Fragment {
        const parts = t.data.split(":");
        if (parts.length === 1) {
            let errorPos = t.ch + ParamRule.name.length + 2;
            throw new CompileError(
                "Missing type annotation.",
                t.line,
                errorPos
            );
        }
        ctx.params.push({
            name: parts[0].trim(),
            type: parts[1].trim().replace(SEMICOLON_RX, "")
        });
        return new NullFragment();
    }
};
