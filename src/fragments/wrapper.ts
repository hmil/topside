import { Context, Fragment } from "../CompilerInterface";
import { ImportContext } from "../rules/import";
import { ParamsContext } from "../rules/param";

export const WrapperBeforeFragment: Fragment = {
    render(ctx: ImportContext & ParamsContext): string {
        const argsExpr = "{" +
                ctx.params.map(p => p.name).join(", ") +
            "}: {" +
                ctx.params.map(p => p.name + ": " + p.type).join(", ") +
            "}";
        
        return (
            ctx.imports
                .map(i => {
                    return "import " + i + ";";
                })
                .join("\n") +
            "\n\n" +
            "export default function(" +
                (ctx.params.length > 0 ? argsExpr : "") + ") {\n" +
            "    return (\n'"
        );
    }
};

export const WrapperAfterFragment: Fragment = {
    render(ctx: Context): string {
        ctx;
        return "');\n};";
    }
};
