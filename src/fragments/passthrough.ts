import { Fragment } from '../CompilerInterface';

const NL_RX = /\n/g;
const QUOT_RX = /'/g;

export class PassThroughFragment implements Fragment {
    constructor(private readonly text: string) {}

    public render(): string {
        return this.text.replace(QUOT_RX, "\\'").replace(NL_RX, "\\n");
    }
}
