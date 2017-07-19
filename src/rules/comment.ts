import { Token } from '../Token';
import NullFragment from '../fragments/null';
import { Context, Fragment, Rule } from '../CompilerInterface';

export const CommentRule: Rule = {
    name: "--",

    analyze(ctx: Context, t: Token): Fragment {
        ctx;
        return new NullFragment(t);
    }
};
