interface Mapping {
  column: number;
  mapping: {
    row: number;
    column: number;
  };
}

export default class SourceMap {
  map: Mapping[][] = null;

  init() {
    this.map = [];
  }

  getLine(transpiledLine: number) {
    return this.map[transpiledLine];
  }

  setLine(builtLine: number, builtColumn: number, originalLine: number, originalColumn: number) {
    // console.log(`Setting mapping from [${builtLine},${builtColumn}] --> [${originalLine - 1},${originalColumn - 1}]`);

    if (!this.map[builtLine]) {
      this.map[builtLine] = [];
    }
    this.map[builtLine].push({ column: builtColumn, mapping: { row: originalLine - 1, column: originalColumn - 1 } });
  }

  resolveLine(line: number, column: number) {
    // map contains line/column mappings
    let mappedLine = this.map[line];
    if (!mappedLine) {
      while (--line >= 0) {
        mappedLine = this.map[line];
        if (mappedLine) {
          return mappedLine[mappedLine.length - 1].mapping.row;
        }
      }
    }

    // find the closest smallest column
    let mapping: Mapping = null;
    for (let mapp of mappedLine) {
      if (mapp.column >= column) {
        mapping = mapp;
        break;
      }
    }

    // in case we did not find a mapping we assume the last known position
    if (mapping == null) {
      mapping = mappedLine[mappedLine.length - 1];
    }

    return mapping.mapping.row;
  }
}
