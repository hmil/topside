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
            const __sectionName = '${this.name}';
            __sections[__sectionName] = ((__parent: () => string) => __safeSection(__safeChildSections[__sectionName])(() => '`;
    }
}

export class EndSectionFragment extends Fragment {

    public render(): string {
        return `'));
            return '';
        })() + '`;
    }
}

export class ParentFragment extends Fragment {

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

export class ShowFragment extends Fragment {

    public render(): string {
        return `'));
            return __sections[__sectionName](() => '')();
        })() + '`;
    }
}
