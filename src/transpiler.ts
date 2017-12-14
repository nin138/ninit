import {readFile} from "./readFile";
import {Toml} from "./util";
import {toTs} from "./toTs";
import {mkdirsSync, writeFile} from "fs-extra";
import {copyTemplate} from "./copyTemplate";
import {createStore} from "./createStore";
import * as Path from "path";

export interface Config {
  group: string
  project: string
  version: string
  root: string
  outDir: string
  dependency: Array<string> //["std"]
  indexPath: string
}

export interface NinComponent {
  use: Array<string> | undefined
  props: Array<{key: string, type: string}>
  state: Array<{key: string, type: string}>
  actions: {[actions: string]: ComponentAction}
  path: string;
  name: string;
  isInline: boolean;
  isFrame: boolean;
  allowChild: boolean;
  parent: string;
  node: Array<NinComponentNode>
  id: string;
  editable: {}
}

export type ComponentAction = {[params: string]: string }

export interface NinComponentNode {
  tag: string
  id: string
  parent: string
  children: Array<string>
  className: Array<string>
  attribute: any
}




export const isNinComponent = (o: any) => {
  return true;//todo
};


const readIndex: () => Promise<Config> = async () => {
  const index = await readFile(process.argv[2] || "index.toml");
  const data = Object.assign({root: "./app"}, Toml.parse(index));
  data.indexPath = (process.argv[2])? Path.dirname(process.argv[2]) : "./index.toml";
  data.outDir = process.argv[3] || "./ninit";
  if(data.group && data.project) return data;
  throw new Error("index.toml require group and project");
};

const readToml: (path: string, conf: Config) => Promise<NinComponent> = async(path, conf) => {
  const file = await readFile(path);
  const t = Toml.parse(file);
  t.path = Path.dirname(path);
  if(!isNinComponent(t)) throw new Error("invalid toml file");
  return t;
};

const readAllToml: (conf: Config) => Promise<Array<NinComponent>> = async(conf) => {
  const ret: Array<NinComponent> = [];
  const read = async(path: string, fileName: string) => {
    console.log(path + fileName);
    const c = await readToml(path + fileName, conf);
    ret.push(c);
    if(c.use) {
      c.use.forEach(async it => {
        const nPath = path + it.substring(2).split("/").slice(0, -1).join("/") + "/";
        await read(nPath, it.split("/").pop()!!)
      });
    }
  };
  const path = conf.indexPath + conf.root.substring(2).split("/").slice(0, -1).join("/") + "/";
  await read(path, conf.root.split("/").pop()!!);
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
    const ts = toTs(c); // require resolve props use children
    modules.push({name: c.name, path: c.path});
    console.log("2");
    await writeTs(`${conf.outDir}/${c.path}/${c.name}.tsx` , ts);
  }

  await writeFile(`${conf.outDir}/src/store.ts`, createStore(modules));
};



