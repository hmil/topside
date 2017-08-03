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
import { ExtendsRule } from './rules/extends';
import { CommentRule } from './rules/comment';
import { EndSectionRule, ParentRule, SectionRule, YieldRule } from './rules/section';

/**
 * Global preconfigured compiler
 */
export const compiler = new Compiler({
    _text: PassThroughRule,
    _default: TextRule
});

compiler.use(CommentRule);
compiler.use(ElseIfRule);
compiler.use(ElseRule);
compiler.use(EndForRule);
compiler.use(EndIfRule);
compiler.use(ExtendsRule);
compiler.use(ForRule);
compiler.use(HtmlRule);
compiler.use(IfRule);
compiler.use(ImportRule);
compiler.use(ParentRule);
compiler.use(ParamRule);
compiler.use(PassThroughRule);
compiler.use(SectionRule);
compiler.use(EndSectionRule);
compiler.use(TextRule);
compiler.use(YieldRule);

compiler.addFragment("before", WrapperBeforeFragment);
compiler.addFragment("after", WrapperAfterFragment);
