import {readFile} from "./readFile";
// import * as fs from "fs-extra";
import {Parser} from "./parser";

export const current_dir = process.cwd() + "/";
export const out_dir = `${process.cwd()}/ninit/`;

// readFile("nin/index.toml")
readFile("nin/src/app.toml")
    .then((text: string) => onReadIndex(text))
    .then(res => {
      console.log("fin");
      console.log(res);
    })
    .catch(e => { throw e });

const onReadIndex = (text: string) => {
  const parser = new Parser(text);
  return parser.parse();
};
// fs.removeSync(out_dir);
// fs.mkdirSync(out_dir);
// fs.copySync(current_dir + "template/index.html", out_dir + "index.html");