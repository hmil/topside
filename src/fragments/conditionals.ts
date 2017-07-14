import { Fragment } from '../CompilerInterface';


export class IfFragment implements Fragment {
    constructor(private readonly expr: string) {}

    public render(): string {
        return (
            "' + \n" +
            "(function() {\n" +
            "    if (" +
            this.expr +
            ") {\n" +
            "        return ('"
        );
    }
}

export class ElseIfFragment implements Fragment {
    constructor(private readonly expr: string) {}

    public render(): string {
        return (
            "');\n" +
            "    } else if (" +
            this.expr +
            ") {\n" +
            "        return ('"
        );
    }
}

export class ElseFragment implements Fragment {
    public render(): string {
        return "');\n" + "    } else {\n" + "        return ('";
    }
}

export class EndIfFragment implements Fragment {
    public render(): string {
        return "');\n" + "    }\n" + "    return '';" + "}()) + '";
    }
}
