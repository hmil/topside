import { ISourcePosition } from '../ISourcePosition';
import { Fragment } from '../CompilerInterface';

export class PassThroughFragment extends Fragment {
    constructor(
            position: ISourcePosition,
            private readonly text: string) {
        super(position);
    }

    public render(): string {
        return JSON.stringify(this.text).slice(1, -1);
    }
}
