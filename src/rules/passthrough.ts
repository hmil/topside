import { Context, Fragment, Rule } from '../CompilerInterface';
import { PassThroughFragment } from '../fragments/passthrough';
import { Token } from '../Token';

export const PassThroughRule: Rule = {
    name: "passthrough",

    analyze(ctx: Context, t: Token): Fragment {
        return new PassThroughFragment(t.data);
    }
};
