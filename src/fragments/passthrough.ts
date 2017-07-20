import { ISourcePosition } from '../ISourcePosition';
import { Fragment } from '../CompilerInterface';

const NL_RX = /\n/g;
const QUOT_RX = /'/g;

export class PassThroughFragment extends Fragment {
    constructor(
            position: ISourcePosition,
            private readonly text: string) {
        super(position);
    }

    public render(): string {
        return this.text.replace(QUOT_RX, "\\'").replace(NL_RX, "\\n");
    }
}
