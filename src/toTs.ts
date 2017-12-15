import {createTab} from "./util";
import {HTML_TAGS, TEXT_NODE} from "./html_tags";
import {NinComponent, NinComponentNode} from "./Entity/NinComponent";



class TsClassCreator {
  create(nin: NinComponent): string {
    return `export class ${nin.name} extends React.Component<Props, ${(nin.state.length != 0)? "State" : "{}"}> {\n`
    + this.createRender(nin)
    + "}\n";
  }
  private createRender(nin: NinComponent): string {
    let ret = `${createTab(1)}render() {\n${createTab(2)}return (\n`;
    const map: Map<string, NinComponentNode> = new Map();
    nin.node.forEach(it => map.set(it.id, it));
    const tmp = nin.node.filter(it => it!!.parent == "root");
    if(tmp.length == 0) throw new Error("Empty body Component");
    if(tmp.length != 1) throw new Error("more than 1 root Node found");
    const root: NinComponentNode = tmp[0];
    ret += this.createJSX(root.id, map, 3) + "\n";
    ret += `${createTab(2)})\n`;
    ret += `${createTab(1)}}\n`;
    return ret;
  }
  private createJSX(id: string, map: Map<string, NinComponentNode>, tab: number): string {
    const component = map.get(id)!!;
    const attrs = this.createAttribute(component);
    if(component.tag === TEXT_NODE) return `${createTab(tab)}${component.attribute.text || ""}\n`;
    if(/[a-z]/.test(component.tag.charAt(0))) {
      if(!HTML_TAGS[component.tag]) throw new Error(`${component.tag} is not defined in HTML5`);
      if(!HTML_TAGS[component.tag].hasChild) {
        return `${createTab(tab)}<${component.tag} />\n`
      }
    }
    return `${createTab(tab)}<${component.tag}${attrs}>\n`
    + component.children.map(it => this.createJSX(it, map, tab+1)).join("\n") + "\n"
    + `${createTab(tab)}</${component.tag}>`;
  };
  private createAttribute(node: NinComponentNode) {
    const ret = Object.keys(node.attribute)
        .map(it => `${it}=${node.attribute[it]}`)
        .join(" ");
    return (ret === "")? "" : " " + ret;
  }

}

class TsFileCreator {
  private static readonly REQUIRED_IMPORT = [
    `import * as React from "react";`,
  ].join("\n") + "\n";
  private classCreator = new TsClassCreator();
  private resolveDependency(nin: NinComponent): string {
    let ts = TsFileCreator.REQUIRED_IMPORT;
    if(nin.use) {
      nin.use.map(((it: string) => `import {${nin.name}} from "/${nin.path}";\n`))
          .forEach(it => ts += it);
    }
    return ts;
  };
  private createKeyType(arr: Array<{key: string, type: string}>): string {
    return arr.reduce((pre, cur) => `${pre}  ${cur.key}: ${cur.type}\n`, "");
  };
  private createIFProps(nin: NinComponent): string {
    return `interface Props {\n${this.createKeyType(nin.props)}}\n`;
  };
  private createIFState(nin: NinComponent): string {
    if(nin.state.length == 0) return "";
    return `interface State {\n${this.createKeyType(nin.props)}}\n`;
  };
  create(nin: NinComponent): string {
    return this.resolveDependency(nin)
    + this.createIFProps(nin)
    + this.createIFState(nin)
    + this.classCreator.create(nin);
  }
}
const tsCreator = new TsFileCreator();
export const toTs = (nin: NinComponent): string => {
  return tsCreator.create(nin);
};