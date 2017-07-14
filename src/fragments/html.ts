import { Fragment } from '../CompilerInterface';


export class HtmlFragment implements Fragment {
    constructor(private readonly html: string) {}

    public render(): string {
        return "' + (" + this.html + ") + '";
    }
}
