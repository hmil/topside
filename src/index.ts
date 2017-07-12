import Compiler from "./Compiler"
import {
  WrapperAfterFragment,
  WrapperBeforeFragment
} from "./fragments/wrapper"
import { ElseIfRule, ElseRule, EndIfRule, IfRule } from "./rules/conditionals"
import { EndForRule, ForRule } from "./rules/for"
import { ImportRule } from "./rules/import"
import { ParamRule } from "./rules/param"
import { PassThroughRule } from "./rules/passthrough"
import { TextRule } from "./rules/text"
import Tokenizer from "./Tokenizer"

import * as fs from "fs"

const content = fs.readFileSync("examples/simple.html")
let tokenizer = new Tokenizer()

tokenizer.consume(content.toString())

const tokens = tokenizer.close()

console.error(tokens)

const compiler = new Compiler({
  _text: PassThroughRule,
  _default: TextRule
})
compiler.use(TextRule)
compiler.use(PassThroughRule)
compiler.use(ImportRule)
compiler.use(ParamRule)
compiler.use(ForRule)
compiler.use(EndForRule)
compiler.use(IfRule)
compiler.use(ElseIfRule)
compiler.use(ElseRule)
compiler.use(EndIfRule)

compiler.addFragment("before", WrapperBeforeFragment)
compiler.addFragment("after", WrapperAfterFragment)

console.log(compiler.processTokens(tokens))
