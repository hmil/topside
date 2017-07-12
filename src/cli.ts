import { compiler } from "./topside";

import * as minimist from "minimist";
import * as fs from "fs";
import * as path from "path";

let argv = minimist(process.argv.slice(2));

function usage() {
    console.log("usage: topside template");
}

if (argv._.length < 1) {
    usage();
    process.exit(1);
}

const template = fs.readFileSync(path.resolve(argv._[0])).toString();
const compiled = compiler.compile(template);

const filePath = path.parse(argv._[0]);
filePath.ext = ".ts";
delete filePath.base;

const dest = path.resolve(path.format(filePath));

fs.writeFileSync(dest, compiled);
