// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)

import Compiler from './Compiler';
import { WrapperAfterFragment, WrapperBeforeFragment } from './fragments/wrapper';
import { ElseIfRule, ElseRule, EndIfRule, IfRule } from './rules/conditionals';
import { EndForRule, ForRule } from './rules/for';
import { HtmlRule } from './rules/html';
import { ImportRule } from './rules/import';
import { ParamRule } from './rules/param';
import { PassThroughRule } from './rules/passthrough';
import { TextRule } from './rules/text';

/**
 * Global preconfigured compiler
 */
export const compiler = new Compiler({
    _text: PassThroughRule,
    _default: TextRule
});

compiler.use(TextRule);
compiler.use(HtmlRule);
compiler.use(PassThroughRule);
compiler.use(ImportRule);
compiler.use(ParamRule);
compiler.use(ForRule);
compiler.use(EndForRule);
compiler.use(IfRule);
compiler.use(ElseIfRule);
compiler.use(ElseRule);
compiler.use(EndIfRule);

compiler.addFragment("before", WrapperBeforeFragment);
compiler.addFragment("after", WrapperAfterFragment);
