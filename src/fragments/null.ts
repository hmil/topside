import { Fragment } from "../CompilerInterface";

export default class NullFragment extends Fragment {
    public render(): string {
        return "";
    }
}
