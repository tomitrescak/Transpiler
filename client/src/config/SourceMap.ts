export default class SourceMap {
  private map: number[] = null;
  private max: number;
  private currentLine: number;
  private text: string;
  private nodeLine: number;

  init() {
    this.map = [];
    this.max = -1;
    this.currentLine = 0;
    this.text = '';
  }

  inc(num = 1) {
    this.currentLine += num;
    console.log(`Increasing and setting line on ${this.currentLine} to ${this.currentLine}`);
    this.map[this.currentLine] = this.nodeLine;
  }

  getLine(transpiledLine: number) {
    return this.map[transpiledLine];
  }

  setLine(node: AstNode) {
    console.log(`Setting line on ${node.node}: ${node.line - 1} to ${this.currentLine}`);
    //console.trace();
    this.nodeLine = node.line - 1;
    this.map[this.currentLine] = this.nodeLine;

    if (this.max < this.currentLine) {
      this.max = this.currentLine;
    }
  }
}
