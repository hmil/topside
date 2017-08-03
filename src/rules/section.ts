import { BeginSectionFragment, EndSectionFragment, YieldFragment, ParentFragment } from '../fragments/section';
import { Context, Fragment, Rule } from "../CompilerInterface";
import { Token } from "../Token";

declare module "../CompilerInterface" {
    interface Context {
        sections: {
            names: string[];
        }
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
        const name = t.data.trim();
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
        const name = t.data.trim();
        if (ctx.sections.names.indexOf(name) === -1) {
            ctx.sections.names.push(name);
        }
        return new YieldFragment(t, name);
    }
};
