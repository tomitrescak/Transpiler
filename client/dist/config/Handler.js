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
    Handler.prototype.addInfo = function (message, location) {
        this.infos.push({ message: message, line: location.line, column: location.column });
    };
    Handler.prototype.addError = function (message, location) {
        this.errors.push({ message: message, line: location.line, column: location.column });
    };
    Handler.prototype.addWarning = function (message, location) {
        this.warnings.push({ message: message, line: location.line, column: location.column });
    };
    return Handler;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Handler;
