import { BeginSectionFragment, EndSectionFragment, ParentFragment, ShowFragment, YieldFragment } from '../fragments/section';
import { Context, Fragment, Rule } from "../CompilerInterface";
import { Token } from "../Token";

declare module "../CompilerInterface" {
    interface Context {
        sections: {
            names: string[];
        }
    }
}

function cleanQuotes(str: string): string {
    str = str.trim();
    const q = str.charAt(0);
    if (q === "'" || q === '"') {
        if (str.charAt(str.length - 1) === q) {
            return str.substr(1, str.length - 2);
        } else {
            throw new Error(`Invalid string literal: ${str}`)
        }
    }
    return str;
}

export const SectionRule: Rule = {
    name: "section",

    initContext(ctx: Context): void {
        ctx.sections = {
            names: [ ]
        }
    },

    analyze(ctx: Context, t: Token): Fragment {
        // TODO: support the form @section('name', 'data')
        const name = cleanQuotes(t.data);
        if (ctx.sections.names.indexOf(name) === -1) {
            ctx.sections.names.push(name);
        }
        return new BeginSectionFragment(t, name);
    }
};

export const EndSectionRule: Rule = {
    name: "endsection",

    analyze(_ctx: Context, t: Token): Fragment {
        return new EndSectionFragment(t);
    }
};

export const ParentRule: Rule = {
    name: "parent",

    analyze(_ctx: Context, t: Token): Fragment {
        return new ParentFragment(t);
    }
};

export const YieldRule: Rule = {
    name: "yield",

    analyze(ctx: Context, t: Token): Fragment {
        const name = cleanQuotes(t.data);
        if (ctx.sections.names.indexOf(name) === -1) {
            ctx.sections.names.push(name);
        }
        return new YieldFragment(t, name);
    }
};

export const ShowRule: Rule = {
    name: "show",

    analyze(_ctx: Context, t: Token): Fragment {
        return new ShowFragment(t);
    }
}
