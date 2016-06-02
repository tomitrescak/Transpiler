"use strict";
var Messages_1 = require('../config/Messages');
var LeftPad_1 = require('../config/LeftPad');
var Visitor = (function () {
    function Visitor(parent) {
        this.parent = parent;
    }
    // static bits
    Visitor.checkNode = function (node, expectedNames) {
        if (Array.isArray(expectedNames)) {
            if (expectedNames.indexOf(node.node) === -1) {
                throw new Error("Unexpected node '" + node.node + "' expected '" + expectedNames.join() + "'");
            }
        }
        if (node.node !== expectedNames) {
            throw new Error("Unexpected node '" + node.node + "' expected '" + expectedNames + "'");
        }
    };
    Visitor.join = function (array, joinWith, append) {
        if (joinWith === void 0) { joinWith = ', '; }
        if (append === void 0) { append = ''; }
        if (array && array.length) {
            return array.join(joinWith) + append;
        }
        return '';
    };
    Visitor.addInfo = function (message, line, column) {
        if (column === void 0) { column = 0; }
        Visitor.handler.addInfo(message, line, column);
    };
    Visitor.addError = function (message, line, column) {
        if (column === void 0) { column = 0; }
        Visitor.handler.addError(message, line, column);
    };
    Visitor.addWarning = function (message, line, column) {
        if (column === void 0) { column = 0; }
        Visitor.handler.addWarning(message, line, column);
    };
    Visitor.prototype.build = function (node, text) {
        if (node.line !== undefined && node.line !== null) {
            Visitor.sourceMap.setLine(node);
        }
        for (var i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                Visitor.sourceMap.inc();
            }
        }
        return text;
    };
    Visitor.prototype.pad = function (text) {
        if (text === void 0) { text = ''; }
        return LeftPad_1.default(text, this.indent);
    };
    Visitor.prototype.incIndent = function () {
        this.indent += 2;
    };
    Object.defineProperty(Visitor.prototype, "indent", {
        get: function () {
            if (this._indent) {
                return this._indent;
            }
            else if (this.parent) {
                return this.parent.indent;
            }
            return 0;
        },
        set: function (ind) {
            this._indent = ind;
        },
        enumerable: true,
        configurable: true
    });
    Visitor.messages = Messages_1.default;
    Visitor.Warnigns = Messages_1.default.Warnings;
    Visitor.Errors = Messages_1.default.Errors;
    Visitor.Infos = Messages_1.default.Infos;
    return Visitor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Visitor;
