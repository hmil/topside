import * as ts from "typescript";
import { SourceMapConsumer } from 'source-map';
import * as fs from 'fs';

export function check(fileNames: string[], options: ts.CompilerOptions): void {
    let program = ts.createProgram(fileNames, options);
    let emitResult = program.emit();

    const diags = (emitResult.diagnostics instanceof Array) ? emitResult.diagnostics : [emitResult.diagnostics];

    let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(diags);

    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file == null || diagnostic.start == null) return;

            console.log('Diagnostic in ' + diagnostic.file.fileName);

            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);

            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

        try {
            const consumer = new SourceMapConsumer(fs.readFileSync(diagnostic.file.fileName + '.map').toString());
            const origPos = consumer.originalPositionFor({
                line: line + 1,
                column: character + 1
            });
            console.log(`${origPos.source} (${origPos.line},${origPos.column}): ${message}`);
        } catch (e) {
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        }

    });

    let exitCode = emitResult.emitSkipped ? 1 : 0;
    console.log(`Process exiting with code '${exitCode}'.`);
    // process.exit(exitCode);
}

// for (let i of process.argv.slice(2)) {
// check([i], {
//     noEmitOnError: true,
//     "moduleResolution": ts.ModuleResolutionKind.NodeJs,
//         "target": ts.ScriptTarget.ES5,
//         "module": ts.ModuleKind.CommonJS,
//         // "lib": ["es2015", "es2016", "es2017", "dom"],
//         "strict": true,
//         "allowUnreachableCode": true,
//         "strictNullChecks": true,
//         "noUnusedLocals": true,
//         "noUnusedParameters": true,
//         "noImplicitAny": true,
//         "noImplicitThis": true,
//         "noImplicitReturns": true,
//         "outDir": ".compiled",
// });
// }