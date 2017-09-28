import {readFile} from "./src/readFile";

readFile("./nin/index.nin").then((text: string) => console.log(text));