// import * as fs from "fs-extra";
// import {readIndex} from "./transpiler";

import {readFile} from "./readFile";
import {Toml} from "./util";

export const current_dir = process.cwd() + "/";
export const out_dir = `${process.cwd()}/ninit/`;



// readFile("nin/index.nin")
readFile("toml/src/app.toml")
    .then((text: string) => {
      const st = Toml.parse(text);
      console.log(Toml.stringify(st)); // -> {whatever: 1}
    }).catch(e => { throw e });





// readIndex().then(it => console.log(it));


// fs.removeSync(out_dir);
// fs.mkdirSync(out_dir);
// fs.copySync(current_dir + "template/index.html", out_dir + "index.html");