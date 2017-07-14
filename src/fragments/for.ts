import { Fragment } from '../CompilerInterface';


export class BeginForFragment implements Fragment {
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

export class EndForFragment implements Fragment {
    public render(): string {
        return "');\n" + "    }\n" + "    return __acc;\n" + "}()) + '";
    }
}
