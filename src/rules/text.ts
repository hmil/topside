import { Context, Fragment, Rule } from '../CompilerInterface';
import { TextFragment } from '../fragments/text';
import { Token } from '../Token';
import { ImportContext } from './import';

export interface TextContext extends Context {
    text: {
        hasImports: boolean;
    };
}

export const TextRule: Rule = {
    name: "text",

    initContext(ctx: TextContext): void {
        ctx.text = {
            hasImports: false
        };
    },

    analyze(ctx: TextContext & ImportContext, t: Token): Fragment {
        if (!ctx.text.hasImports) {
            ctx.imports.push('* as __escape from "escape-html"');
            ctx.text.hasImports = true;
        }
        return new TextFragment(t.data);
    }
};
