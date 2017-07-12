import { Context, Fragment, Rule } from "../CompilerInterface"
import { Token } from "../Token"

const NL_RX = /\n/g
const QUOT_RX = /'/g

class PassThroughFragment implements Fragment {
  constructor(private readonly text: string) {}

  public render(): string {
    return this.text.replace(QUOT_RX, "\\'").replace(NL_RX, "\\n") + "' +\n'"
  }
}

export const PassThroughRule: Rule = {
  name: "passthrough",

  analyze(ctx: Context, t: Token): Fragment {
    return new PassThroughFragment(t.data)
  }
}
