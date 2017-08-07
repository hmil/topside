import { ISourcePosition } from '../ISourcePosition';
import { Fragment } from '../CompilerInterface';


export class BeginForFragment extends Fragment {
    constructor(
            position: ISourcePosition,
            private readonly expr: string) {
        super(position);
    }

    public render(): string {
        return (
            '" + \n' +
            '(function() {\n' +
            '    let __acc = "";\n' +
            '    for (let ' +
            this.expr +
            ') {\n' +
            '        __acc += ("'
        );
    }
}

export class EndForFragment extends Fragment {
    public render(): string {
        return '");\n' + '    }\n' + '    return __acc;\n' + '}()) + "';
    }
}
