import { Context, Fragment, Rule } from "../CompilerInterface"
import { Token } from "../Token"

class HtmlFragment implements Fragment {
  constructor(private readonly html: string) {}

  public render(): string {
    return "' + (" + this.html + ") + '"
  }
}

export const HtmlRule: Rule = {
  name: "html",

  analyze(ctx: Context, t: Token): Fragment {
    return new HtmlFragment(t.data)
  }
}
