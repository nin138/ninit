import {NinComponent, NinComponentNode, NinKeyType} from "./transpiler";
import {Map} from "immutable";
import {createTab} from "./util";

const requireImport = [
    `import * as React from "react";`,
].join("\n") + "\n";


class TsClassCreator {
  create(nin: NinComponent): string {
    return `export class ${nin.name} extends React.Component<Props, ${(nin.state.length != 0)? "State" : "{}"}> {\n`
    + this.createRender(nin)
    + "}\n";
  }
  private createRender(nin: NinComponent): string {
    let ret = `render() {\n`;
    const map: Map<string, NinComponentNode> = Map();
    nin.node.forEach(it => map.set(it.id, it));
    const tmp = nin.node.filter(it => it!!.parent == "root");
    if(tmp.length == 0) throw new Error("Empty body Component");
    if(tmp.length != 1) throw new Error("more than 1 root Node found");
    const root: NinComponentNode = tmp[0];
    ret += this.createJSX(root.id, map, 2);
    ret += "}\n";
    return ret;
  }
  private createJSX(id: string, map: Map<string, NinComponentNode>, tab: number): string {
    const component = map.get(id);
    const attrs = this.createAttribute(component);
    return `${createTab(tab)}<${component.type}${attrs}>\n`
    + component.children.map(it => this.createJSX(it, map, tab+1)).join("\n") + "\n"
    + `${createTab(tab)}</${component.type}>\n`;
  };
  private createAttribute(node: NinComponentNode) {
    const ret = Object.keys(node.attribute)
        .map(it => `${it}=${node.attribute[it]}`)
        .join(" ");
    return (ret === "")? "" : " " + ret;
  }

}

export const toTs = (nin: NinComponent): string => {
  const resolveDependency = (nin: NinComponent): string => {
    let ts = requireImport;
    nin.using.map(((it: string) => `import {${nin.name}} from "/${nin.path}";\n`))
        .forEach(it => ts += it);
    return ts;
  };
  const createKeyType = (arr: Array<NinKeyType>): string => {
    return arr.reduce((pre, cur) => `${pre}  ${cur.key}: ${cur.type}\n`, "");
  };
  const createIFProps = (nin: NinComponent): string => {
    return `interface Props {\n${createKeyType(nin.props)}}\n`;
  };
  const createIFState = (nin: NinComponent): string => {
    if(nin.state.length == 0) return "";
    return `interface State {\n${createKeyType(nin.props)}}\n`;
  };
};