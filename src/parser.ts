export class Parser {
  private index = 0;
  __text: string;
  private result: any = {};
  // private lines = [];
  constructor(private text: string) { this.__text = text; }
  async parse() {
    while(this.text.length > this.index) {
      const ret = await this.read();
      if(ret.key) this.result[ret.key] = ret.value;
    }
    console.log(this.result);
  }
  private getLineNumber(index: number) {
    return this.__text.substr(0, index).split("").filter(c => c == "\n").length + 1
  }
  private async read() {
    const key = await this.getKey();
    const value = await this.getValue();
    return { key, value };
  }
  private getKey(): string {
    const ret = this.readTo(/:/);
    if(ret.end) return "";
    const key = ret.line.trim();
    if(!/[a-z|A-Z]/.test(key[0]) || key.includes("\n") || key.includes(" ")) throw new Error(`key is incorrect at line: ${this.getLineNumber(this.index)}`);
    return key;
  }
  private getValue(): string {
    const type = this.readTo(/\S/).match;
    switch(type) {
      case "[": return this.readArray();
      case "{": return "b";
      default: return type + this.readTo(/\s/).line;
    }
  }
  private readArray(): string {
    const body = this.readTo(/]/).line
        .split(/\n|,/)
        .filter(it => it.trim())
        .map(it => it.trim());
    return "[" + body + "]";
  }
  private readTo(reg: RegExp): {line: string, match: string, end?: boolean } {
    let line = "";
    while(!reg.test(this.text[this.index])) {
      line += this.text[this.index];
      this.index++;
      if(this.text.length < this.index - 1) return { end: true, line: "", match: "" };
    }
    const match = this.text[this.index];
    this.index++;
    return { line, match };
  }

}

