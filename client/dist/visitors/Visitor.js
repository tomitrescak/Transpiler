"use strict";
var Visitor = (function () {
    // constructor
    function Visitor(parent, node, nodeName) {
        this.check(node, nodeName);
        this.parent = parent;
        this.node = node;
    }
    Object.defineProperty(Visitor.prototype, "location", {
        // properties
        get: function () {
            return this.node.location;
        },
        enumerable: true,
        configurable: true
    });
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
    // methods
    Visitor.prototype.incIndent = function () {
        this.indent += 2;
    };
    Visitor.prototype.addError = function (error) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.handler) {
            this.parent.addError(error, args);
            return;
        }
        this.handler.addError(error(args), this.location);
    };
    Visitor.prototype.addErrorAtLocation = function (location, error) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (!this.handler) {
            this.parent.addErrorAtLocation(location, error, args);
            return;
        }
        this.handler.addError(error(args), location);
    };
    Visitor.prototype.addWarning = function (warning) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.handler) {
            this.parent.addWarning(warning, args);
            return;
        }
        this.handler.addWarning(warning(args), this.location);
    };
    /**
     * Checks the current name of the node, in case of failure it throws an exception
     * @param  {AstElement | AstElement[]}   node          [description]
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
