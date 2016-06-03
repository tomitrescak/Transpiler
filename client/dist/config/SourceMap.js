"use strict";
var SourceMap = (function () {
    function SourceMap() {
        this.map = null;
    }
    SourceMap.prototype.init = function () {
        this.map = [];
        this.max = -1;
        this.currentLine = 0;
        this.text = '';
    };
    SourceMap.prototype.inc = function (num) {
        if (num === void 0) { num = 1; }
        this.currentLine += num;
        console.log("Increasing and setting line on " + this.currentLine + " to " + this.currentLine);
        this.map[this.currentLine] = this.nodeLine;
    };
    SourceMap.prototype.getLine = function (transpiledLine) {
        return this.map[transpiledLine];
    };
    SourceMap.prototype.setLine = function (node) {
        console.log("Setting line on " + node.node + ": " + (node.line - 1) + " to " + this.currentLine);
        //console.trace();
        this.nodeLine = node.line - 1;
        this.map[this.currentLine] = this.nodeLine;
        if (this.max < this.currentLine) {
            this.max = this.currentLine;
        }
    };
    return SourceMap;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SourceMap;
