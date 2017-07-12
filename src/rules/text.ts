import { Context, Fragment, Rule } from "../CompilerInterface"
import { Token } from "../Token"
import { ImportContext } from "./import"

export interface TextContext extends Context {
  text: {
    hasImports: boolean
  }
}

class TextFragment implements Fragment {
  constructor(private readonly text: string) {}

  public render(): string {
    return "' + __escape(" + this.text + ") + '"
  }
}

export const TextRule: Rule = {
  name: "text",

  initContext(ctx: TextContext): void {
    ctx.text = {
      hasImports: false
    }
  },

  analyze(ctx: TextContext & ImportContext, t: Token): Fragment {
    if (!ctx.text.hasImports) {
      ctx.imports.push('{ __escape } from "topside"')
      ctx.text.hasImports = true
    }
    return new TextFragment(t.data)
  }
}
