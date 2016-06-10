"use strict";
var LeftPad_1 = require('../config/LeftPad');
var Messages_1 = require('../config/Messages');
var Visitor = (function () {
    // constructor
    function Visitor(parent, node, nodeName) {
        this.check(node, nodeName);
        this.parent = parent;
        this.node = node;
    }
    // static bits
    Visitor.prototype.findMethodType = function (visitor) {
        var child = visitor['expression'];
        var name = visitor['name'] ? visitor['name'].name : null;
        if (child) {
            // child can be field access or just a qualified name
            var callChildName = child.node.node === 'QualifiedName' ? 'qualifier' : 'expression';
            // find the owner type, and pass MethodInvocation as the paren of this call
            var type = this.findVariableType(child, callChildName, 'MethodInvocation');
            // now find the method in the owner and return type
            var method = type.findMethodInSuperClass(name);
            if (!method) {
                this.addError(Messages_1.default.Errors.MethodNotFound, name);
                throw new Error(Messages_1.default.Errors.MethodNotFound(name));
            }
            var typ = method.returnType.originalName;
            return this.owner.compilationUnit.findDeclaration(typ);
        }
    };
    Visitor.prototype.findVariableType = function (visitor, childName, nodeName) {
        if (childName === void 0) { childName = 'qualifier'; }
        if (nodeName === void 0) { nodeName = 'QualifiedName'; }
        var child = visitor[childName];
        var name = visitor['name'] ? visitor['name'].name : null;
        if (child) {
            // child can also be method invocation
            var callChildName = child.node.node === 'QualifiedName' ? 'qualifier' : 'expression';
            var callNodeName = child.node.node === 'QualifiedName' ? 'QualifiedName' : 'FieldAccess';
            var type = child.node.node === 'MethodInvocation' ?
                this.findMethodType(child) :
                this.findVariableType(child, callChildName, callNodeName);
            // check if type exists
            if (!type) {
                this.addError(Messages_1.default.Errors.VariableNotFound, child.name.name);
                throw new Error(Messages_1.default.Errors.VariableNotFound(child.name.name));
            }
            // in case this is the last variable of the chain we return its type
            if (Array.isArray(nodeName) && nodeName.indexOf(visitor.parent.node.node) === -1 ||
                !Array.isArray(nodeName) && visitor.parent.node.node !== nodeName) {
                return type;
            }
            // othrwise we continue
            // find the field with this name and find its type
            var field = type.findField(name);
            if (!field) {
                return null;
            }
            // find the type declaration of this field
            var typeName = field.type.originalName;
            return this.compilationUnit.findDeclaration(typeName);
        }
        else {
            // this is the end of the referecne chain {A}.b.c.d
            // A can be either a this, super, class memeber or a static reference
            if (visitor.node.node === 'ThisExpression') {
                return visitor.owner;
            }
            if (visitor.node.node === 'SuperFieldAccess') {
                // find the type of the super reference
                var field = visitor.owner.findFieldInSuperClass(name);
                if (!field) {
                    return null;
                }
                var type = field.type.originalName;
                return this.compilationUnit.findDeclaration(type);
            }
            // possible member is announced without this. expression
            var member = visitor.findVariableInParent(visitor, name);
            if (member) {
                return this.compilationUnit.findDeclaration(member.type.originalName);
            }
            else {
                // otherwise is just a static expression
                return visitor.compilationUnit.findDeclaration(name);
            }
        }
    };
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
    Visitor.prototype.checkAssignment = function (left, right) {
        var fidx = Visitor.order.indexOf(left);
        var iidx = Visitor.order.indexOf(right);
        // console.log('ITYPE: ' + initializerType)
        // check numbers
        if (fidx > -1 && iidx > -1) {
            if (fidx < iidx) {
                this.addError(Messages_1.default.Errors.TypeMismatch, right, left);
            }
        }
        // strings
        if (left === 'String' && right === 'char') {
            this.addError(Messages_1.default.Errors.TypeMismatch, right, left);
        }
        if (left === 'char' && right === 'String') {
            this.addError(Messages_1.default.Errors.TypeMismatch, right, left);
        }
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
    Visitor.order = ['byte', 'short', 'int', 'long', 'float', 'double'];
    Visitor.maxValue = [128, 32768, 2147483648, 9.223372037E18, 0, 0];
    return Visitor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Visitor;
