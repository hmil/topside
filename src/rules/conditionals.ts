import { Context, Fragment, Rule } from "../CompilerInterface"
import { Token } from "../Token"

class IfFragment implements Fragment {
  constructor(private readonly expr: string) {}

  public render(): string {
    return (
      "' + \n" +
      "(function() {\n" +
      "    if (" +
      this.expr +
      ") {\n" +
      "        return ('"
    )
  }
}

class ElseIfFragment implements Fragment {
  constructor(private readonly expr: string) {}

  public render(): string {
    return (
      "');\n" + "    } else if (" + this.expr + ") {\n" + "        return ('"
    )
  }
}

class ElseFragment implements Fragment {
  public render(): string {
    return "');\n" + "    } else {\n" + "        return ('"
  }
}

class EndIfFragment implements Fragment {
  public render(): string {
    return "');\n" + "    }\n" + "    return '';" + "}()) + '"
  }
}

export const IfRule: Rule = {
  name: "if",

  analyze(ctx: Context, t: Token): Fragment {
    return new IfFragment(t.data)
  }
}

export const ElseRule: Rule = {
  name: "else",

  analyze(): Fragment {
    return new ElseFragment()
  }
}

export const ElseIfRule: Rule = {
  name: "elseif",

  analyze(ctx: Context, t: Token): Fragment {
    return new ElseIfFragment(t.data)
  }
}

export const EndIfRule: Rule = {
  name: "endif",

  analyze(): Fragment {
    return new EndIfFragment()
  }
}
