// import * as fs from "fs-extra";
// const Toml = require('toml-js');
import {readIndex} from "./transpiler";

export const current_dir = process.cwd() + "/";
export const out_dir = `${process.cwd()}/ninit/`;

// readFile("nin/index.nin")
// readFile("toml/src/app.toml")
//     .then((text: string) => console.log(Toml.parse(text)))
//     .catch(e => { throw e });
readIndex().then(it => console.log(it));


// fs.removeSync(out_dir);
// fs.mkdirSync(out_dir);
// fs.copySync(current_dir + "template/index.html", out_dir + "index.html");