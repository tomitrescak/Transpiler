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
        console.log('Increasing');
        this.currentLine += num;
    };
    SourceMap.prototype.getLine = function (transpiledLine) {
        return this.map[transpiledLine];
    };
    SourceMap.prototype.setLine = function (node) {
        console.log("Setting line on " + node.node + ": " + (node.line - 1) + " to " + this.currentLine);
        //console.trace();
        this.map[this.currentLine] = node.line - 1;
        if (this.max < this.currentLine) {
            this.max = this.currentLine;
        }
    };
    return SourceMap;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SourceMap;
