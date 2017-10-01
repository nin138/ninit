const line = "3 4 3\n" +
    "RBG\n" +
    "BGG\n" +
    "GBR\n" +
    "GBB";
const line1 = line.split("\n")[0].split(" ").map(it => +it);
const column = line1[0];
const row = line1[1];
const magic = line1[2];

const copy = (arr) => {
  return JSON.parse( JSON.stringify(arr));
};

let arr = line.split("\n")
    .filter((it, i) => i !== 0 && it !== "")
    .map(it => it.split(""));

let arrCopy = copy(arr);

const erase = (c, r, t) => {
  const color = arr[r][c];
  if(color === "") return 0;
  if(t !== undefined && t !== color) return 0;
  arr[r][c] = "";
  let ret = 1;
  if(c > 0) ret += erase(c-1, r, color);
  if(r > 0) ret += erase(c, r-1, color);
  if(c < column - 1) ret += erase(c+1, r, color);
  if(r < row -1) ret += erase(c, r+1, color);
  return ret;
};

const afterErase = () => {
  for(let c = 0; c < column; c++) {
    for(let r = row-1; r >= 0; r--) {
      if(arr[r][c] === "") {
        let ref = r-1;
        while(ref >= 0) {
          if(arr[ref][c] !== "") {
            arr[r][c] = arr[ref][c];
            arr[ref][c] = "";
            break;
          }
          ref--;
        }
      }
    }
  }
};

let ret = "";
let used = 0;
while(magic > used) {
  let maxC;
  let maxR;
  let maxCount = 0;
  for(let c = 0; c < column; c++) {
    arr = copy(arrCopy);
    for(let r = 0; r < row; r++) {
      const ret = erase(c, r);
      if(ret > maxCount) {
        maxR = r;
        maxC = c;
        maxCount = ret;
      }
    }
  }

  if(maxC === undefined) break;
  ret += `${maxC + 1} ${maxR + 1}\n`;
  used++;
  arr = copy(arrCopy);
  erase(maxC, maxR);
  afterErase();
  arrCopy = copy(arr);
}
console.log(`${used}\n${ret}`);
