import { Context, Fragment, Rule } from "../CompilerInterface";
import { Token } from "../Token";

class BeginForFragment implements Fragment {
    constructor(private readonly expr: string) {}

    public render(): string {
        return (
            "' + \n" +
            "(function() {\n" +
            "    let __acc = '';\n" +
            "    for (let " +
            this.expr +
            ") {\n" +
            "        __acc += ('"
        );
    }
}

class EndForFragment implements Fragment {
    public render(): string {
        return "');\n" + "    }\n" + "    return __acc;\n" + "}()) + '";
    }
}

export const ForRule: Rule = {
    name: "for",

    analyze(ctx: Context, t: Token): Fragment {
        return new BeginForFragment(t.data);
    }
};

export const EndForRule: Rule = {
    name: "endfor",

    analyze(): Fragment {
        return new EndForFragment();
    }
};
