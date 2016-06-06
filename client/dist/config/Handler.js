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
        if (typeof (message) === 'string') {
            this.errors.push({ message: message, line: location.line, column: location.column });
        }
        else {
            this.errors.push(message);
        }
    };
    Handler.prototype.addWarning = function (message, location) {
        if (typeof (message) === 'string') {
            this.warnings.push({ message: message, line: location.line, column: location.column });
        }
        else {
            this.warnings.push(message);
        }
    };
    return Handler;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Handler;
