interface Mapping {
  column: number;
  mapping: {
    row: number;
    column: number;
  };
}

export default class SourceMap {
  private map: Mapping[][] = null;

  init() {
    this.map = [];
  }

  getLine(transpiledLine: number) {
    return this.map[transpiledLine];
  }

  setLine(builtLine: number, builtColumn: number, originalLine: number, originalColumn: number) {
    //console.log(`Setting mapping from [${builtLine},${builtColumn}] --> [${originalLine - 1},${originalColumn - 1}]`);
    if (!this.map[builtLine]) {
      this.map[builtLine] = [];
    }
    this.map[builtLine].push({ column: builtColumn, mapping: { row: originalLine - 1, column: originalColumn - 1 } });
  }
}
