import {readFile} from "./readFile";
import {Toml} from "./util";

interface Config {
  group: string
  project: string
  version: string
  root: string// "/app"
  dependency: Array<string> //["std"]
}

export interface NinKeyType {
  key: string
  type: string
}

export interface NinComponent {
  using: Array<string>
  props: Array<NinKeyType>
  state: Array<NinKeyType>
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

export interface NinComponentNode {
  type: string//"std.HTML.input"
  id: string
  parent: string
  children: Array<string>
  className: Array<string>
  attribute: any
}




export const isNinComponent = (o: any) => {
  return o.path != undefined;
};

const defaultConfig = {
  root: "/app",
};


export const readIndex: () => Promise<Config> = async () => {
  const path = process.argv[2] || "index.toml";
  const file = await readFile(path);
  const data = Object.assign(defaultConfig, Toml.parse(file));
  if(data.group && data.project) return data;
  throw new Error("index.toml require group and project");
};

const readToml: (path: string) => Promise<NinComponent> = async(path) => {
  const file = await readFile(path);
  const t = Toml.parse(file);
  if(!isNinComponent(t)) throw new Error("invalid file");
  return t;
};

const readAllToml: (root: string) => Promise<Array<NinComponent>> = async(root) => {
  const ret: Array<NinComponent> = [];
  const read = async(path: string) => {
    const c = await readToml(path);
    ret.push(c);
    c.using.forEach(it => read(it));
  };
  await read(root);
  return ret;
};

export const transpile = async () => {
  const conf = await readIndex();
  const components: Array<NinComponent> = await readAllToml(conf.root);

  const outDir = "";
  components.map(it => {
    const ts = toTs(it); // require resolve props use children
    const module = createModule(it);
    writeTs(`${outDir}/${it.path}/${it.name}.tsx` , ts);
    writeTs(`${outDir}/${it.path}/Module.ts`, module);
  });

  createStore();
};


