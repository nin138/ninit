import {readFile} from "./readFile";
// import * as fs from "fs-extra";
import * as Toml from "toml";
// const Toml = require('toml-js');
export const current_dir = process.cwd() + "/";
export const out_dir = `${process.cwd()}/ninit/`;

// readFile("nin/index.nin")
readFile("toml/src/app.toml")
    .then((text: string) => console.log(Toml.parse(text)))
    .catch(e => { throw e });

// fs.removeSync(out_dir);
// fs.mkdirSync(out_dir);
// fs.copySync(current_dir + "template/index.html", out_dir + "index.html");