import { compiler } from "./topside";

import * as minimist from 'minimist';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

let argv = minimist(process.argv.slice(2));

function processFile(arg: string): void {
    const file = path.resolve(arg);
    const template = fs.readFileSync(file).toString();
    const compiled = compiler.compile(template, {
        file
    });

    const filePath = path.parse(arg);
    filePath.ext = ".ts";
    filePath.base = filePath.name + filePath.ext;

    const dest = path.resolve(path.format(filePath));
    fs.writeFileSync(dest, compiled.code + "\n//# sourceMappingURL=" + filePath.name + '.ts.map');
    fs.writeFileSync(dest + '.map', compiled.map);
}

for (let i = 0 ; i < argv._.length ; i++) {
    glob(argv._[i], (err, files) => {
        if (err) throw err;
        files.forEach(processFile);
    });
}
