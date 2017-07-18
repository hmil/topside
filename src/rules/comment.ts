import NullFragment from '../fragments/null';
import { Fragment, Rule } from '../CompilerInterface';

export const CommentRule: Rule = {
    name: "--",

    analyze(): Fragment {
        return new NullFragment();
    }
};
