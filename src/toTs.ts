// import {NinComponent, NinKeyType} from "./transpiler";
//
// const requireImport = [
//     `import * as React from "react";`,
// ].join("\n") + "\n";
//
//
// export const toTs = (nin: NinComponent): string => {
//   const resolveDependency = (nin: NinComponent): string => {
//     let ts = requireImport;
//     nin.using.map(((it: string) => `import {${nin.name}} from "/${nin.path}";\n`))
//         .forEach(it => ts += it);
//     return ts;
//   };
//   const createKeyType = (arr: Array<NinKeyType>): string => {
//     return arr.reduce((pre, cur) => `${pre}  ${cur.key}: ${cur.type}\n`, "");
//   };
//   const createIFProps = (nin: NinComponent): string => {
//     return `interface Props {\n${createKeyType(nin.props)}}\n`;
//   };
//   const createIFState = (nin: NinComponent): string => {
//     if(nin.state.length == 0) return "";
//     return `interface State {\n${createKeyType(nin.props)}}\n`;
//   };
//
//   const createClass = (nin: NinComponent): string => {
//     const createRender = (nin: NinComponent): string => {
//       let ret = `render() {\n`;
//       const map = nin
//       ret += "}\n";
//     };
//     let ret = `export class ${nin.name} extends React.Component<Props, ${(nin.state.length != 0)? "State" : "{}"}> {\n`;
//     return ret;
//   }
// };