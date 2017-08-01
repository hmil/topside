import { compiler } from "./topside";

import * as minimist from 'minimist';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as mkdirp from 'mkdirp';

let argv = minimist(process.argv.slice(2));
let outDir: string | null = null;
let baseDir = process.cwd();

function processFile(arg: string): void {
    const file = path.resolve(arg);
    const template = fs.readFileSync(file).toString();
    const compiled = compiler.compile(template, {
        file
    });

    const filePath = path.parse(arg);
    filePath.ext = ".ts";
    filePath.base = filePath.name + filePath.ext;
    if (outDir) {
        filePath.dir = path.resolve(outDir, path.relative(baseDir, filePath.dir));
    }
    mkdirp(filePath.dir, function (err: any) {
        if (err) {
            console.error(err);
        } else {
            const dest = path.resolve(path.format(filePath));
            fs.writeFileSync(dest, compiled.code + "\n//# sourceMappingURL=" + filePath.name + '.ts.map');
            fs.writeFileSync(dest + '.map', compiled.map);
        }
    });

}

if (argv.outDir) {
    outDir = path.resolve(process.cwd(), argv.outDir);
}

if (argv.baseDir) {
    baseDir = path.resolve(process.cwd(), argv.baseDir);
}

for (let i = 0 ; i < argv._.length ; i++) {
    glob(argv._[i], (err, files) => {
        if (err) throw err;
        files.forEach(processFile);
    });
}
