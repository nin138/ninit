import * as fs from "fs";

export const readFile = async(path: string): Promise<string> => {
  return fs.readFile(path, 'utf8', (err: string, text: string) => {
    if(err) throw new Error(err);
    return text;
  });
};