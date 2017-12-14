import {ComponentAction, NinComponent} from "./transpiler";
import {createTab} from "./util";

const createActionNames = (nin: NinComponent) => {
  return `enum ActionNames {\n` +
      `${Object.keys(nin.actions).map(it => `${createTab(1)}${it} = "${nin.name}.${it}"`).join("\n")}` +
      "}";
};

const createActions = (nin: NinComponent) => {
  const createActionInterface = (name: string, action: ComponentAction) => {
    return `interface ${nin.name}Action\n {` +
        + `${createTab(1)}type: ActionNames.${name},` +
        Object.keys(action).map(param => `${createTab(1)}${param}: ${action[param]}`).join(",\n") +
        "}";
  };

  const createActionFunc = (name: string, action: ComponentAction) => {
    return `export const ${name} = (${Object.keys(action).map(param => {`${param}: ${action[param]}`}).join(", ")}) => ({\n` +
        `${createTab(1)}type: ActionNames.${name},\n` +
        Object.keys(action).map(it => createTab(1) + it).join(",\n") +
        "});";

  };

  return Object.keys(nin.actions).map(name => {
    const action = nin.actions[name];
    return `${createActionInterface(name, action)}\n${createActionFunc(name, action)}`
  }).join("\n\n");
};

const createActionType = (nin: NinComponent) => {
  if(Object.keys(nin.actions).length === 0) return "";
  return `export type ${nin.name}Action =\n` +
      Object.keys(nin.actions).map(it => `${it}Action`).join(" |\n")
};

const createState = (nin: NinComponent) => {
  return ""//todo
};

const createInitialState = (nin: NinComponent) => {
  return ""//todo
};

const createReducer = (nin: NinComponent) => {
  return ""//todo
};

export const createModule = (nin: NinComponent) => {
  return [
      createActionNames(nin),
      createActions(nin),
      createActionType(nin),
      createState(nin),
      createInitialState(nin),
      createReducer(nin)
  ].join("\n\n")
};