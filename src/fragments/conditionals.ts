import { ISourcePosition } from '../ISourcePosition';
import { Fragment } from '../CompilerInterface';


export class IfFragment extends Fragment {
    constructor(
            position: ISourcePosition,
            private readonly expr: string) {
        super(position);
    }

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

export class ElseIfFragment extends Fragment {
    constructor(
            position: ISourcePosition,
            private readonly expr: string) {
        super(position);
    }

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

export class ElseFragment extends Fragment {

    public render(): string {
        return "');\n" + "    } else {\n" + "        return ('";
    }
}

export class EndIfFragment extends Fragment {
    public render(): string {
        return "');\n" + "    }\n" + "    return '';" + "}()) + '";
    }
}
