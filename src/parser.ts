export class Parser {
  private index = 0;
  __text: string;
  // private lines = [];
  constructor(private text: string) { this.__text = text; }
  async parse() {
    while(this.text.length > this.index) {
      await this.toLines();
    }
  }
  private getLineNumber(index: number) {
    return this.__text.substr(0, index).split("").filter(c => c == "\n").length + 1
  }
  private async toLines() {
    const key = await this.getKey();
    const value = await this.getValue();
    console.log(`${key} \\\\ ${value}`);
    return 1;
  }
  private async getKey(): Promise<string> {
    const key = this.readTo(/:/).line.trim();
    if(!/[a-z|A-Z]/.test(key[0]) || key.includes("\n") || key.includes(" ")) throw new Error(`key is incorrect at line: ${this.getLineNumber(this.index)}`);
    return key;
  }
  private async getValue(): Promise<string> {
    const type = this.readTo(/\S/).match;
    switch(type) {
      case "[": return this.readArray();
      case "{": return "b";
      default: return type + this.readTo(/\s/).line;
    }
  }
  private async readArray() {
    console.log(this.text[this.index]);
    return this.readTo(/]/).line;
  }
  private readTo(reg: RegExp) {
    let line = "";
    while(!reg.test(this.text[this.index])) {
      line += this.text[this.index];
      this.index++;
      if(this.text.length < this.index - 1) throw new Error("fin");
    }
    const match = this.text[this.index];
    this.index++;
    return { line, match };
  }

}

