export class Parser {
  private index = 0;
  __text: string;
  // private lines = [];
  constructor(private text: string) { this.__text = text; }
  parse() {
    this.toLines();
  }
  private getLineNumber(index: number) {
    return this.__text.substr(0, index).split("").filter(c => c == "\n").length + 1
  }
  private toLines() {
    const key = this.readTo(/:/).line.trim();
    if(key.includes("\n") || key.includes(" ")) {
      console.log(`key is incorrect at line: ${this.getLineNumber(this.index)}`);
      return;
    }
    console.log(key);
  }
  private readTo(reg: RegExp) {
    let line = "";
    while(!reg.test(this.text[this.index])) {
      line += this.text[this.index];
      this.index++;
    }
    const match = this.text[this.index];
    this.index++;
    return { line, match };
  }

}