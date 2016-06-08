"use strict";
var SourceMap = (function () {
    function SourceMap() {
        this.map = null;
    }
    SourceMap.prototype.init = function () {
        this.map = [];
    };
    SourceMap.prototype.getLine = function (transpiledLine) {
        return this.map[transpiledLine];
    };
    SourceMap.prototype.setLine = function (builtLine, builtColumn, originalLine, originalColumn) {
        //console.log(`Setting mapping from [${builtLine},${builtColumn}] --> [${originalLine - 1},${originalColumn - 1}]`);
        if (!this.map[builtLine]) {
            this.map[builtLine] = [];
        }
        this.map[builtLine].push({ column: builtColumn, mapping: { row: originalLine - 1, column: originalColumn - 1 } });
    };
    return SourceMap;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SourceMap;
