import {
    BeginSectionFragment,
    EndSectionFragment,
    InlineSectionFragment,
    ParentFragment,
    ShowFragment,
    YieldFragment,
} from '../fragments/section';
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

/**
 * Extracts the section name from the tag.
 *
 * In case the string is quoted, quotes are removed (to support usage à la blade).
 *
 * For simplicity, this just looks if there's a comma and uses everything before.
 * It is pretty intuitive when the at-rule is used without quotes as recommended
 * in the doc but counter-intuitively fails to parse @section('aa,bb');
 *
 * @param str The input string as seen in the source
 */
function getCleanSectionName(str: string): string {
    return cleanQuotes(str.split(',')[0]);
}

/**
 * Extracts the section data from the tag.
 *
 * Users can use the shorthand
 *
 *     @section(name, data)
 *
 * Which stands for
 *
 *     @section(name)@(data)@endsection
 *
 * @param str The input string as seen in the source
 */
function getCleanSectionData(str: string): string | null {
    const commaIdx = str.indexOf(',');
    if (commaIdx === -1) {
        return null;
    }
    else {
        return str.substr(commaIdx + 1).trim();
    }
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
        const name = getCleanSectionName(t.data);
        if (ctx.sections.names.indexOf(name) === -1) {
            ctx.sections.names.push(name);
        }
        const data = getCleanSectionData(t.data);
        if (data != null) {
            return new InlineSectionFragment(t, name, data);
        } else {
            return new BeginSectionFragment(t, name);
        }
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
