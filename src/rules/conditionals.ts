import { Context, Fragment, Rule } from '../CompilerInterface';
import { ElseFragment, ElseIfFragment, EndIfFragment, IfFragment } from '../fragments/conditionals';
import { Token } from '../Token';

declare module "../CompilerInterface" {
    interface Context {
        conditionals: {
            statementStack: Array<{
                hasElse: boolean
            }>
        }
    }
}


export const IfRule: Rule = {
    name: "if",

    initContext(ctx: Context): void {
        ctx.conditionals = {
            statementStack: []
        };
    },

    analyze(ctx: Context, t: Token): Fragment {
        ctx.conditionals.statementStack.splice(0, 0, {
            hasElse: false
        });
        return new IfFragment(t, t.data);
    }
};

export const ElseRule: Rule = {
    name: "else",

    analyze(ctx: Context, t: Token): Fragment {
        ctx.conditionals.statementStack[0].hasElse = true;
        return new ElseFragment(t);
    }
};

export const ElseIfRule: Rule = {
    name: "elseif",

    analyze(_: Context, t: Token): Fragment {
        return new ElseIfFragment(t, t.data);
    }
};

export const EndIfRule: Rule = {
    name: "endif",

    analyze(ctx: Context, t: Token): Fragment {
        // Skips the return statement if there is an `else` block to avoid generating unreachable code.
        const returnStatement = !ctx.conditionals.statementStack[0].hasElse;
        ctx.conditionals.statementStack.splice(0, 1);
        return new EndIfFragment(t, returnStatement);
    }
};
