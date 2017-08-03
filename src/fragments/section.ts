import { ISourcePosition } from '../ISourcePosition';
import { Fragment } from '../CompilerInterface';


export class BeginSectionFragment extends Fragment {
    constructor(
            position: ISourcePosition,
            private readonly name: string) {
        super(position);
    }

    public render(): string {
        return `' + (() => {
            __sections['${this.name}'] = ((__parent: () => string) => __safeSection(__safeChildSections['${this.name}'])(() => '`;
    }
}

export class EndSectionFragment extends Fragment {
    constructor(
            position: ISourcePosition) {
        super(position);
    }

    public render(): string {
        return `'));
            return '';
        })() + '`;
    }
}

export class ParentFragment extends Fragment {
    constructor(
            position: ISourcePosition) {
        super(position);
    }

    public render(): string {
        return `' + __parent() + '`;
    }
}

export class YieldFragment extends Fragment {
    constructor(
            position: ISourcePosition,
            private readonly name: string) {
        super(position);
    }

    public render(): string {
        return `' + __sections['${this.name}'](() => '')() + '`;
    }
}
