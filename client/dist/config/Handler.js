"use strict";
var Message = (function () {
    function Message() {
    }
    return Message;
}());
var Handler = (function () {
    function Handler() {
        this.warnings = [];
        this.infos = [];
        this.errors = [];
    }
    Handler.prototype.addInfo = function (message, line, column) {
        if (column === void 0) { column = 0; }
        this.infos.push({ message: message, line: line, column: column });
    };
    Handler.prototype.addError = function (message, line, column) {
        if (column === void 0) { column = 0; }
        this.errors.push({ message: message, line: line, column: column });
    };
    Handler.prototype.addWarning = function (message, line, column) {
        if (column === void 0) { column = 0; }
        this.warnings.push({ message: message, line: line, column: column });
    };
    return Handler;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Handler;
