import { Context, Fragment, Rule } from '../CompilerInterface';
import { TextFragment } from '../fragments/text';
import { Token } from '../Token';


export const TextRule: Rule = {
    name: "text",

    analyze(_ctx: Context, t: Token): Fragment {
        return new TextFragment(t, t.data);
    }
};
