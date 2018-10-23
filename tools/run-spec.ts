import * as path from 'path';
import { diffLines } from 'diff';
import * as fs from 'fs';

const { ls, exec, echo } = require('shelljs');
const colors = require("colors");

echo('Running specs...');
if (exec('bin/topside --outDir spec/output/views/ --baseDir spec/fixtures/templates spec/fixtures/templates/*.top.html').code) {
    echo(colors.red('Failed to compile templates.'));
    process.exit(1);
}

let status = 0;
const ok_specs = ls('spec/tests/OK/*.ts');

for (let spec of ok_specs) {
    const parsed = path.parse(spec);
    process.stdout.write(`Running spec: ${spec}\t`);
    exec(`node_modules/.bin/ts-node -P spec/tsconfig.json ${spec} > spec/output/${parsed.name}.html`);
    const diff = do_diff(`spec/references/${parsed.name}.html`, `spec/output/${parsed.name}.html`);
    if (diff) {
        echo(colors.red('FAILED'));
        console.log(diff);
        status++;
    } else {
        echo(colors.green('OK'));
    }
}

const fail_specs = ls('spec/tests/ERR/*.ts');

for (let spec of fail_specs) {
    process.stdout.write(`Running spec: ${spec}\t`);
    if(exec(`node_modules/.bin/ts-node -P spec/tsconfig.json ${spec} 2>/dev/null >/dev/null`).code) {
        echo(colors.green('OK'));
    } else {
        echo(colors.red('FAILED'));
        status++;
    }
}


process.exit(status);

function do_diff(expected: string, actual: string) {
    let diff = '';
    diffLines(
        fs.readFileSync(expected).toString(), 
        fs.readFileSync(actual).toString(), {
            ignoreWhitespace: false,
            newlineIsToken: true,
            ignoreCase: false
        }
    ).forEach((part) => {
        if(part.added) {
            diff += colors.green('+ ' + part.value) + '\n';
        } else if (part.removed) {
            diff += colors.red('- ' + part.value) + '\n';
        }
    });
    return diff;
}
