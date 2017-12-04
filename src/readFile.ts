import * as fs from "fs";

export const readFile = (path: string): Promise<string> => {
  return new Promise(((resolve, reject) => {
    const encode: string = "utf8";
    fs.readFile(path, encode, (err: NodeJS.ErrnoException, data: string) => {
      if(err) reject(err);
      resolve(data);
    });
  }));
};



