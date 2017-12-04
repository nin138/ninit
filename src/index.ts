// import * as fs from "fs-extra";
// import {readIndex} from "./transpiler";


import {transpile} from "./transpiler";

export const current_dir = process.cwd() + "/";



// readFile("nin/index.nin")
// readFile("toml/src/App.toml")
//     .then((text: string) => {
//       const st = Toml.parse(text);
//       console.log(Toml.stringify(st)); // -> {whatever: 1}
//     }).catch(e => { throw e });
transpile()
    .then(() => console.log("ok"))
    .catch(e => console.log(`error::${e}`));




// readIndex().then(it => console.log(it));


// fs.removeSync(out_dir);
// fs.mkdirSync(out_dir);
// fs.copySync(current_dir + "template/index.html", out_dir + "index.html");