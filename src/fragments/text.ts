import { Fragment } from '../CompilerInterface';


export class TextFragment implements Fragment {
    constructor(private readonly text: string) {}

    public render(): string {
        return "' + __escape('' + (" + this.text + ")) + '";
    }
}
