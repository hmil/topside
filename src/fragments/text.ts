import { ISourcePosition } from '../ISourcePosition';
import { Fragment } from '../CompilerInterface';


export class TextFragment extends Fragment {
    constructor(
            position: ISourcePosition,
            private readonly text: string) {
        super(position);
    }

    public render(): string {
        return "' + __escape('' + (" + this.text + ")) + '";
    }
}
