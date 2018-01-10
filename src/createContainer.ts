import {Config} from "./Entity/Config";
import * as Path from "path";
import {createTab} from "./util";

const requiredImport = [
    'import {connect} from "react-redux";',
];

const resolveImports = (config: Config, dispatchers: Array<{name: string, path: string}>) => {
  return requiredImport.join("\n") +
      `import ${Path.basename(config.root, ".toml")} from "./${config.root}";\n` +
      dispatchers.map(it => `import {${it.name}ActionDispatcher} from "${it.path}";\n`).join() +
      `import ${config.root} from "./${config.root}";\n` +
      `import {RootAction} from "./Store";\n`;
};

const createActionDispatcher = (dispatchers: Array<{name: string, path: string}>) => {
  return `export class ActionDispatcher {\n` +
      dispatchers.map(it => `${createTab(1)}${it.name}: ${it.name}ActionDispatcher;\n`).join() +
      `${createTab(1)}constructor(private dispatch : (action: RootAction) => void) {\n` +
      dispatchers.map(it => `${createTab(2)}this.${it.name} = new ${it.name}ActionDispatcher(dispatch);\n`).join() +
      `${createTab(1)}}\n` +
      `}\n`;
};

export const createContainer = (config: Config, dispatchers: Array<{name: string, path: string}>) => {
  return resolveImports(config, dispatchers) +
  createActionDispatcher(dispatchers) +
  `export default connect(state => state, dispatch => ({actions: new ActionDispatcher(dispatch)}))(${config.root})`;
};
