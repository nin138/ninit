import * as bombadil from "@sgarciac/bombadil"
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