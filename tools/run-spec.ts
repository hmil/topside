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
const ok_specs = ls('spec/tests/*.ts');

for (let spec of ok_specs) {
    const parsed = path.parse(spec);
    process.stdout.write(`Running spec: ${spec}\t`);
    exec(`node_modules/.bin/ts-node -P spec ${spec} > spec/output/${parsed.name}.html`);
    const diff = do_diff(`spec/references/${parsed.name}.html`, `spec/output/${parsed.name}.html`);
    if (diff) {
        echo(colors.red('FAILED'));
        console.log(diff);
        status++;
    } else {
        echo(colors.green('OK'));
    }
}


process.exit(status);

function do_diff(expected: string, actual: string) {
    let diff = '';
    diffLines(
        fs.readFileSync(expected).toString(), 
        fs.readFileSync(actual).toString(), {
            ignoreWhitespace: false,
            newlineIsToken: true
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
