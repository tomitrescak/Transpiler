"use strict";
var LeftPad_1 = require('../config/LeftPad');
var Visitor = (function () {
    // constructor
    function Visitor(parent, node, nodeName) {
        this.check(node, nodeName);
        this.parent = parent;
        this.node = node;
    }
    // static bits
    Visitor.prototype.findSuperClass = function () {
        var owner = this.owner; // that's the compilation unit
        if (!owner.superClassType) {
            return null;
        }
        return owner.compilationUnit.findDeclaration(owner.superClassType);
    };
    Visitor.prototype.findVariableInSuperClass = function (name) {
        var superClass = this.findSuperClass();
        if (!superClass) {
            return null;
        }
        return superClass.findVariable(name);
    };
    Visitor.prototype.findVariableInParent = function (parent, name) {
        // find if name exists in the parent scope
        var vh = parent;
        if (vh.variables && vh.variables.length) {
            var variable = vh.findVariable(name);
            if (variable) {
                return variable;
            }
        }
        if (parent.parent.node.node !== 'CompilationUnit') {
            return this.findVariableInParent(parent.parent, name);
        }
        else {
            return this.findVariableInSuperClass(name);
        }
    };
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
    Object.defineProperty(Visitor.prototype, "owner", {
        get: function () {
            return this.findParent('TypeDeclaration');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Visitor.prototype, "compilationUnit", {
        get: function () {
            return this.findParent('CompilationUnit');
        },
        enumerable: true,
        configurable: true
    });
    // methods
    Visitor.prototype.incIndent = function () {
        this.indent += 2;
    };
    Visitor.prototype.pad = function () {
        return LeftPad_1.default('', this.indent);
    };
    Visitor.prototype.addError = function (error) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.handler) {
            (_a = this.parent).addErrorAtLocation.apply(_a, [this.location, error].concat(args));
            return;
        }
        this.handler.addError(error.apply(void 0, args), this.location.line, this.location.column);
        var _a;
    };
    Visitor.prototype.addErrorAtLocation = function (location, error) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (!this.handler) {
            (_a = this.parent).addErrorAtLocation.apply(_a, [location, error].concat(args));
            return;
        }
        this.handler.addError(error.apply(void 0, args), location.line, location.column);
        var _a;
    };
    Visitor.prototype.addWarning = function (warning) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.handler) {
            this.parent.addWarningAtLocation(this.location, warning, args);
            return;
        }
        this.handler.addWarning(warning(args), this.location.line, this.location.column);
    };
    Visitor.prototype.addWarningAtLocation = function (location, warning) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (!this.handler) {
            this.parent.addWarningAtLocation(location, warning, args);
            return;
        }
        this.handler.addWarning(warning(args), location.line, location.column);
    };
    Visitor.prototype.findParent = function (names) {
        var parent = this;
        if (parent == null) {
            throw new Error('Parent not found: ' + names);
        }
        if (Array.isArray(names)) {
            if (names.indexOf(parent.node.node) > -1) {
                return parent;
            }
        }
        else {
            if (names === parent.node.node) {
                return parent;
            }
        }
        return this.parent.findParent(names);
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
