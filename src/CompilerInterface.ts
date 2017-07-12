import { Token } from "./Token"

export class Context {}

export interface Fragment {
  render(ctx: Context): string
}

export interface Rule {
  name: string
  initContext?(ctx: Context): void
  analyze(ctx: Context, t: Token): Fragment
}

export interface RuleBook {
  [key: string]: Rule
  _text: Rule
  _default: Rule
}
