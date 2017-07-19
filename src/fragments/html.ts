import { ISourcePosition } from '../ISourcePosition';
import { Fragment } from '../CompilerInterface';


export class HtmlFragment extends Fragment {
    constructor(
            position: ISourcePosition,
            private readonly html: string) {
        super(position);
    }

    public render(): string {
        return "' + (" + this.html + ") + '";
    }
}
