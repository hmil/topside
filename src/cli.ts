import { compiler } from "./topside";

import * as minimist from "minimist";
import * as fs from "fs";
import * as path from "path";

let argv = minimist(process.argv.slice(2));

function processFile(arg: string): void {
    const file = path.resolve(arg);
    const template = fs.readFileSync(file).toString();
    const compiled = compiler.compile(template, {
        file
    });

    const filePath = path.parse(arg);
    filePath.ext = ".ts";
    delete filePath.base;

    const dest = path.resolve(path.format(filePath));

    fs.writeFileSync(dest, compiled);
}

for (let i = 0 ; i < argv._.length ; i++) {
    processFile(argv._[i]);
}
