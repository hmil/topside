import { Context, Fragment, Rule } from '../CompilerInterface';
import { TextFragment } from '../fragments/text';
import { Token } from '../Token';

declare module "../CompilerInterface" {
    interface Context {
        text: {
            hasImports: boolean;
        }
    }
}

export const TextRule: Rule = {
    name: "text",

    initContext(ctx: Context): void {
        ctx.text = {
            hasImports: false
        };
    },

    analyze(ctx: Context, t: Token): Fragment {
        if (!ctx.text.hasImports) {
            ctx.imports.push('* as __escape from "escape-html"');
            ctx.text.hasImports = true;
        }
        return new TextFragment(t, t.data);
    }
};
