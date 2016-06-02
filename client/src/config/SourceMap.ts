export default class SourceMap {
  private map: number[] = null;
  private max: number;
  private currentLine: number;
  private text: string;

  init() {
    this.map = [];
    this.max = -1;
    this.currentLine = 0;
    this.text = '';
  }

  inc(num = 1) {
    console.log('Increasing');
    this.currentLine += num;
  }

  getLine(transpiledLine: number) {
    return this.map[transpiledLine];
  }

  setLine(node: AstNode) {
    console.log(`Setting line on ${node.node}: ${node.line - 1} to ${this.currentLine}`);
    //console.trace();
    this.map[this.currentLine] = node.line - 1;

    if (this.max < this.currentLine) {
      this.max = this.currentLine;
    }
  }
}
