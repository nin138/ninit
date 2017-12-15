import {copySync} from "fs-extra";
import {readFile} from "./readFile";
import {writeFileSync} from "fs";
import {Config} from "./Entity/Config";

export const copyTemplate = (conf: Config) => {
  // replace ${APP_NAME}
  copySync('./template/no_replace', conf.outDir);
  readFile(`./template/package.json`).then(it => {
    it = it.replace("${APP_NAME}", conf.project);
    writeFileSync(`${conf.outDir}/package.json`, it, "utf-8");
  })
};