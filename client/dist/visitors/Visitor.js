"use strict";
var LeftPad_1 = require('../config/LeftPad');
var Visitor = (function () {
    // constructor
    function Visitor(parent) {
        this.parent = parent;
    }
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
        // properties
        set: function (ind) {
            this._indent = ind;
        },
        enumerable: true,
        configurable: true
    });
    // methods
    Visitor.prototype.pad = function (text) {
        if (text === void 0) { text = ''; }
        return LeftPad_1.default(text, this.indent);
    };
    Visitor.prototype.incIndent = function () {
        this.indent += 2;
    };
    /**
     * Checks the current name of the node, in case of failure it throws an exception
     * @param  {AstNode | AstNode[]}   node          [description]
     * @param  {string  | string[]}    expectedNames [description]
     */
    Visitor.prototype.check = function (node, expectedNames) {
        if (Array.isArray(node)) {
            return;
        }
        if (Array.isArray(expectedNames)) {
            if (expectedNames.indexOf(node.node) === -1) {
                throw new Error("Unexpected node '" + node.node + "' expected '" + expectedNames.join() + "'");
            }
        }
        if (node.node !== expectedNames) {
            throw new Error("Unexpected node '" + node.node + "' expected '" + expectedNames + "'");
        }
    };
    return Visitor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Visitor;
