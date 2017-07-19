import { ISourcePosition } from './ISourcePosition';
import { Token } from "./Token";

export class Context {}

export interface FragmentCtr {
    new (position: ISourcePosition): Fragment;
}

export abstract class Fragment implements ISourcePosition {
    public readonly line: number;
    public readonly ch: number;
    public readonly file: string;

    constructor(
            position: ISourcePosition) {
        this.line = position.line;
        this.ch = position.ch;
        this.file = position.file;
    }

    public abstract render(ctx: Context): string;
}

export interface Rule {
    name: string;
    initContext?(ctx: Context): void;
    analyze(ctx: Context, t: Token): Fragment | Fragment[];
}

export interface RuleBook {
    [key: string]: Rule;
    _text: Rule;
    _default: Rule;
}
