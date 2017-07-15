import { Context, Fragment, Rule } from '../CompilerInterface';
import { ElseFragment, ElseIfFragment, EndIfFragment, IfFragment } from '../fragments/conditionals';
import { Token } from '../Token';


export const IfRule: Rule = {
    name: "if",

    analyze(ctx: Context, t: Token): Fragment {
        ctx;
        return new IfFragment(t.data);
    }
};

export const ElseRule: Rule = {
    name: "else",

    analyze(): Fragment {
        return new ElseFragment();
    }
};

export const ElseIfRule: Rule = {
    name: "elseif",

    analyze(ctx: Context, t: Token): Fragment {
        ctx;
        return new ElseIfFragment(t.data);
    }
};

export const EndIfRule: Rule = {
    name: "endif",

    analyze(): Fragment {
        return new EndIfFragment();
    }
};
