import { Context, Fragment } from "../CompilerInterface";

export class WrapperBeforeFragment extends Fragment {

    render(ctx: Context): string {
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
}

export class WrapperAfterFragment extends Fragment {

    render(ctx: Context): string {
        ctx;
        return "');\n};";
    }
};
