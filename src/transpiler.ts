import {readFile} from "./readFile";
import {isNinComponent, Toml, toOutPath} from "./util";
import {toTs} from "./toTs";
import {mkdirsSync, writeFile} from "fs-extra";
import {copyTemplate} from "./copyTemplate";
import {createStore} from "./createStore";
import * as Path from "path";
import {createModule} from "./createModule";
import {Config} from "./Entity/Config";
import {NinComponent} from "./Entity/NinComponent";

const readIndex: () => Promise<Config> = async () => {
  const index = await readFile(process.argv[2] || "index.toml");
  const data = Object.assign({root: "./app"}, Toml.parse(index));
  data.indexPath = (process.argv[2])? Path.dirname(process.argv[2]) : "./";
  data.outDir = process.argv[3] || "./ninit";
  if(data.group && data.project) return data;
  throw new Error("index.toml require group and project");
};

const readToml: (path: string) => Promise<NinComponent> = async(path) => {
  const file = await readFile(path);
  const t = Toml.parse(file);
  t.path = Path.dirname(path);
  if(!isNinComponent(t)) throw new Error("invalid toml file");
  return t;
};

const readAllToml: (conf: Config) => Promise<Array<NinComponent>> = async(conf) => {
  const ret: Array<NinComponent> = [];
  const read = async(path: string) => {
    console.log(path);
    const c = await readToml(path);
    ret.push(c);
    if(c.use) {
      c.use.forEach(async it => {
        await read(Path.join(Path.dirname(path), it))
      });
    }
  };
  const path = Path.join(conf.indexPath, conf.root);
  await read(Path.join(path));
  return ret;
};

const writeTs = async(fileName: string, data: string): Promise<{}> => {
  return new Promise((resolve, reject) => {
    mkdirsSync(fileName.split("/").slice(0, -1).join("/"));
    writeFile(fileName, data,(err: NodeJS.ErrnoException | null) => {
      if(err) reject(new Error(`fail to write file: ${fileName}\n${err}`));
      else resolve("ok");
    });
  });
};

export const transpile = async () => {
  const conf = await readIndex();
  const modules: Array<{name: string, path: string}> = [];

  copyTemplate(conf);
  console.log("reading...");
  const components: Array<NinComponent> = await readAllToml(conf);
  console.log("writing...");
  for(let c of components) {
    console.log("1");
    const ts = toTs(c); // todo resolve children's using props
    modules.push({name: c.name, path: c.path});
    console.log("2");
    console.log(`outdir: ${conf.outDir}\ncpath: ${c.path}\ncname: ${c.name}\nout: ${toOutPath(conf, c.path)}`);
    await writeTs(`${toOutPath(conf, c.path)}/${c.name}.tsx` , ts);
    await writeTs(`${toOutPath(conf, c.path)}/${c.name}Module.ts`, createModule(c))
  }
  console.log("index: " + conf.indexPath);
  await writeFile(`${conf.outDir}/src/store.ts`, createStore(conf, modules));

};


