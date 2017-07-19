import { Context, Fragment, Rule } from '../CompilerInterface';
import { HtmlFragment } from '../fragments/html';
import { Token } from '../Token';

export const HtmlRule: Rule = {
    name: "html",

    analyze(ctx: Context, t: Token): Fragment {
        ctx;
        return new HtmlFragment(t, t.data);
    }
};
