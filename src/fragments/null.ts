import { Fragment } from "../CompilerInterface";

export default class NullFragment implements Fragment {
    public render(): string {
        return "";
    }
}
