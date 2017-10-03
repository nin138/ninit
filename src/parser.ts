export class Parser {
  private index = 0;
  private result: any = {};
  // private lines = [];
  constructor(private text: string) { console.log("text is//" + this.text) }
  async parse() {
    while(this.text.length > this.index) {
      const ret = await this.read();
      if(ret.key) this.result[ret.key] = ret.value;
    }
    return (this.result === {})? this.text : this.result;
  }
  private getLineNumber(index: number) {
    return this.text.substr(0, index).split("").filter(c => c == "\n").length + 1
  }
  private async read() {
    const key = await this.readKey();
    const value = await this.getValue();
    return { key, value };
  }
  private readKey(): string {
    const ret = this.readTo(/:/);
    if(ret.end) return "";
    const key = ret.line.trim();
    if(!/[a-z|A-Z]/.test(key[0]) || key.includes("\n") || key.includes(" "))
      throw new Error(`key is incorrect \nkey is: ${key}\n at line: ${this.getLineNumber(this.index)} near\n ${this.text.substr(this.index - 15, 30)}`);
    console.log("key is //" + key);
    return key;
  }
  private getValue(): any {
    const type = this.readTo(/\S/).match;
    switch(type) {
      case "[": return this.readArray();
      case "{": return this.readObject();
      default: {
        return type + this.readTo(/\n/).line.trim();
      }
    }
  }
  private readObject(): Object {

    console.log("obj");
    let objStr = "";
    let tmp = this.readTo(/}/).line.trim() + "}";
    objStr += tmp;
    while(tmp.includes("{")) {
      tmp = this.readTo(/}/).line + "}";
      objStr += tmp;
    }
    console.log("str= " + objStr.slice(0, -1));
    return new Parser(objStr.slice(0, -1)).parse();
  }
  private readArray(): Array<any> {
    return this.readTo(/]/).line
        .split(/[\n,]/)
        .filter(it => it.trim())
        .map(it => it.trim());
  }

  private readTo(reg: RegExp): {line: string, match: string, end?: boolean } {
    let line = "";
    while(!reg.test(this.text[this.index])) {
      line += this.text[this.index];
      this.index++;
      if(this.text.length < this.index - 1) return { end: true, line: line, match: "" };
    }
    const match = this.text[this.index];
    this.index++;
    return { line, match };
  }

}

