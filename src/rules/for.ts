import { Context, Fragment, Rule } from '../CompilerInterface';
import { BeginForFragment, EndForFragment } from '../fragments/for';
import { Token } from '../Token';


export const ForRule: Rule = {
    name: "for",

    analyze(ctx: Context, t: Token): Fragment {
        ctx;
        return new BeginForFragment(t, t.data);
    }
};

export const EndForRule: Rule = {
    name: "endfor",

    analyze(ctx: Context, t: Token): Fragment {
        ctx;
        return new EndForFragment(t);
    }
};
