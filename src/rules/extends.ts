import { Context, Fragment, Rule } from "../CompilerInterface";
import NullFragment from "../fragments/null";
import CompileError from "../CompileError";
import { Token } from "../Token";

declare module "../CompilerInterface" {
    interface Context {
        extends: {
            parentTemplate: string | null
        }
    }
}

export const ExtendsRule: Rule = {
    name: "extends",
    
    initContext(ctx: Context): void {
        ctx.extends = {
            parentTemplate: null
        };
    },

    analyze(ctx: Context, t: Token): Fragment {
        const data = t.data.trim();
        if (data.length < 2 || data.charAt(0) !== data.charAt(data.length-1) || ['"', "'"].indexOf(data.charAt(0)) === -1) {
            console.error(data);
            let errorPos = t.ch + ExtendsRule.name.length + 2;
            throw new CompileError(
                "Invalid parent template name (be sure to use a quoted string)",
                t.line,
                errorPos
            );
        }
        if (ctx.extends.parentTemplate) {
            throw new CompileError(
                "Duplicate 'extends' directives",
                t.line,
                t.ch + 2
            );
        }
        ctx.extends.parentTemplate = data;
        return new NullFragment(t);
    }
};
