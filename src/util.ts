import * as bombadil from "@sgarciac/bombadil"
import {SETTINGS} from "./settings";
import {Config} from "./Entity/Config";
import * as Path from "path";
const tomlify = require('tomlify-j0.4');

export const Toml = {
  parse: (toml: string): any => {
    const reader = new bombadil.TomlReader;
    reader.readToml(toml);
    return reader.result;
  },
  stringify: (obj: any): string => {
    return tomlify.toToml(obj);
  }
};

export const createTab = (num: number): string => {
  const char = (SETTINGS.USE_TAB_CHARACTER)? "\t" : Array(SETTINGS.TAB_SIZE + 1).join(" ");
  return Array(num + 1).join(char);
};

export const toOutPath = (conf: Config, path: string) => {
  return Path.join(conf.outDir, path.substring(conf.indexPath.length));
};

export const isNinComponent = (o: any) => {
  return true;//todo
};
