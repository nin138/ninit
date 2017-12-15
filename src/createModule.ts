import {createTab} from "./util";
import {ComponentAction, NinComponent} from "./Entity/NinComponent";

const createActionNames = (nin: NinComponent) => {
  return `enum ActionNames {\n` +
      `${Object.keys(nin.actions).map(it => `${createTab(1)}${it} = "${nin.name}.${it}"`).join(",\n")}` +
      "\n}\n";
};

const createActions = (nin: NinComponent) => {
  const createActionInterface = (name: string, action: ComponentAction) => {
    return `interface ${name}Action {\n` +
        `${createTab(1)}type: ActionNames.${name},` +
        Object.keys(action).map(param => `\n${createTab(1)}${param}: ${action[param]}`).join(",") +
        "\n}\n";
  };

  const createActionFunc = (name: string, action: ComponentAction) => {
    return `export const ${name} = (${Object.keys(action).map(param => `${param}: ${action[param]}`).join(", ")}) => ({\n` +
        `${createTab(1)}type: ActionNames.${name},` +
        Object.keys(action).map(it => "\n" + createTab(1) + it).join(",") +
        "\n});\n";
  };

  return Object.keys(nin.actions).map(name => {
    const action = nin.actions[name];
    return `${createActionInterface(name, action)}\n${createActionFunc(name, action)}`
  }).join("\n\n");
};

const createActionType = (nin: NinComponent) => {
  if(Object.keys(nin.actions).length === 0) return "";
  return `export type ${nin.name}Action =\n` +
      Object.keys(nin.actions).map(it => `${createTab(1)}${it}Action`).join(" |\n")
};

const createState = (nin: NinComponent) => {
  if(Object.keys(nin.store).length === 0) return "";
  return `export interface ${nin.name}State {\n` +
      Object.keys(nin.store)
          .map(it => `${createTab(1)}${it}: ${nin.store[it]}`)
          .join("\n") +
      "\n}\n";
};

const createInitialState = (nin: NinComponent) => {
  return `const initialState: ${nin.name}State = {\n` +
      Object.keys(nin.initialStore)
          .map(it => `${createTab(1)}${it}: ${nin.initialStore[it]}`)
          .join(",\n") +
      "\n};\n";
};

const createReducer = (nin: NinComponent) => {

  const createCase = (name: string, fn: string) => {
    const parse = (fn: string) => {
      const l = fn.split(" = ");
      return `${l[0]}: ${l[1]}`;
    };
    return `${createTab(2)}case ActionNames.${name}:\n${createTab(3)}return Object.assign({}, state, { ${parse(fn)} });\n`
  };
  return `export default function reducer(state: ${nin.name}State = initialState, action: ${nin.name}Action): ${nin.name}State {\n` +
      `${createTab(1)}switch(action.type) {\n` +
      Object.keys(nin.reducer)
          .map(it => createCase(it, nin.reducer[it]))
          .join("") +
      `${createTab(2)}default: return state\n` +
      `${createTab(1)}}\n}\n`;
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