export class Token {
  constructor(
    public readonly type: string,
    public readonly data: string,
    public readonly line: number,
    public readonly ch: number,
    public readonly ruleName: string
  ) {}
}

export abstract class TokenBuilder {
  public abstract readonly type: string
  public data: string[] = []
  public ruleName: string[] = []

  constructor(public readonly line: number, public readonly ch: number) {}

  public build(): Token {
    return new Token(
      this.type,
      this.data.join(),
      this.line,
      this.ch,
      this.ruleName.join()
    )
  }
}

export class TextToken extends TokenBuilder {
  public static type = "TEXT"
  public readonly type = TextToken.type
}

export class AtRuleToken extends TokenBuilder {
  public static type = "AT_RULE"
  public readonly type = AtRuleToken.type
}

export class InterpolationToken extends TokenBuilder {
  public static type = "INTERPOLATION"
  public readonly type = InterpolationToken.type
}
