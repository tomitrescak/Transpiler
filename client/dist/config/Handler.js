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
        this.infos.push({ message: message, line: line - 1, column: column - 1 });
    };
    Handler.prototype.addError = function (message, line, column) {
        this.errors.push({ message: message, line: line - 1, column: column - 1 });
    };
    Handler.prototype.addWarning = function (message, line, column) {
        this.warnings.push({ message: message, line: line - 1, column: column - 1 });
    };
    return Handler;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Handler;
