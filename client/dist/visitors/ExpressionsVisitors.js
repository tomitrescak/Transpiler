"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var ExpressionFactory_1 = require('./factories/ExpressionFactory');
var NameFactory_1 = require('./factories/NameFactory');
var TypeParameterVisitor_1 = require('./TypeParameterVisitor');
var Messages_1 = require('../config/Messages');
var order = ['byte', 'short', 'int', 'long', 'float', 'double'];
var BaseExpression = (function (_super) {
    __extends(BaseExpression, _super);
    function BaseExpression() {
        _super.apply(this, arguments);
    }
    return BaseExpression;
}(Visitor_1.default));
var NamedExpressionVisitor = (function (_super) {
    __extends(NamedExpressionVisitor, _super);
    function NamedExpressionVisitor(parent, visitor) {
        _super.call(this, parent, visitor.node, null);
        throw new Error('Not implemented ..');
    }
    NamedExpressionVisitor.prototype.visit = function (builder) {
        this.nameVisitor.visit(builder);
    };
    return NamedExpressionVisitor;
}(BaseExpression));
exports.NamedExpressionVisitor = NamedExpressionVisitor;
var StringLiteralVisitor = (function (_super) {
    __extends(StringLiteralVisitor, _super);
    function StringLiteralVisitor(parent, node) {
        _super.call(this, parent, node, 'StringLiteral');
        this.returnType = 'string';
    }
    StringLiteralVisitor.prototype.visit = function (builder) {
        builder.add(this.node.escapedValue, this.location);
    };
    return StringLiteralVisitor;
}(BaseExpression));
exports.StringLiteralVisitor = StringLiteralVisitor;
var CharacterLiteralVisitor = (function (_super) {
    __extends(CharacterLiteralVisitor, _super);
    function CharacterLiteralVisitor(parent, node) {
        _super.call(this, parent, node, 'CharacterLiteral');
        this.returnType = 'char';
    }
    CharacterLiteralVisitor.prototype.visit = function (builder) {
        builder.add(this.node.escapedValue, this.location);
    };
    return CharacterLiteralVisitor;
}(BaseExpression));
exports.CharacterLiteralVisitor = CharacterLiteralVisitor;
var NumberLiteralVisitor = (function (_super) {
    __extends(NumberLiteralVisitor, _super);
    function NumberLiteralVisitor(parent, node) {
        _super.call(this, parent, node, 'NumberLiteral');
        var token = this.node.token;
        var typeModifier = token.charAt(token.length - 1);
        if (typeModifier === 'f' || typeModifier === 'd') {
            if (typeModifier === 'f') {
                this.returnType = 'float';
            }
            else if (typeModifier === 'd') {
                this.returnType = 'double';
            }
            token = token.substring(0, token.length - 1);
        }
        else if (token.indexOf('.') > -1) {
            this.returnType = 'double';
        }
        else {
            // integer type
            var val = parseInt(token, 10);
            if (val >= -128 && val <= 127) {
                this.returnType = 'byte';
            }
            else if (val >= -32768 && val <= 32767) {
                this.returnType = 'short';
            }
            else if (val >= -2147483648 && val <= 2147483647) {
                this.returnType = 'int';
            }
            else {
                this.returnType = 'long';
            }
        }
        this.token = token;
    }
    NumberLiteralVisitor.prototype.visit = function (builder) {
        // trim number modifier
        builder.add(this.token, this.location);
    };
    return NumberLiteralVisitor;
}(BaseExpression));
exports.NumberLiteralVisitor = NumberLiteralVisitor;
var InfixExpressionVisitor = (function (_super) {
    __extends(InfixExpressionVisitor, _super);
    function InfixExpressionVisitor(parent, node) {
        _super.call(this, parent, node, 'InfixExpression');
        this.left = ExpressionFactory_1.default.create(this, this.node.leftOperand);
        this.right = ExpressionFactory_1.default.create(this, this.node.rightOperand);
    }
    Object.defineProperty(InfixExpressionVisitor.prototype, "returnType", {
        // in the beggining the retun value is not initialised
        // by calling validate the initial value is obtaned from children
        get: function () {
            if (this._returnType === undefined) {
                this.validate();
            }
            return this._returnType;
        },
        enumerable: true,
        configurable: true
    });
    InfixExpressionVisitor.prototype.validate = function () {
        var _a = this, left = _a.left, right = _a.right;
        // detect the return type for string
        if (this.node.operator === '+' && (left.returnType === 'string' || right.returnType === 'string')) {
            this._returnType = 'string';
        }
        else {
            this._returnType = left.returnType;
        }
        var lidx = order.indexOf(left.returnType);
        var ridx = order.indexOf(right.returnType);
        // detect return type for numbers
        if (lidx > -1 && ridx > -1) {
            if (lidx < ridx) {
                this._returnType = right.returnType;
            }
            else {
                this._returnType = left.returnType;
            }
            // round non float types from long lower (idx of long is 4)
            if (lidx < 4 && ridx < 4 && this.node.operator === '/') {
                this.nonFloatingPointType = true;
            }
        }
        // make sure that booleans are also correctly detected
        if (this.node.operator === '&&' || this.node.operator === '||') {
            if (left.returnType !== 'boolean') {
                this.addError(Messages_1.default.Errors.TypeMismatch, left.returnType, 'boolean');
            }
            else if (right.returnType !== 'boolean') {
                this.addError(Messages_1.default.Errors.TypeMismatch, right.returnType, 'boolean');
            }
        }
    };
    InfixExpressionVisitor.prototype.visit = function (builder) {
        this.validate();
        // non floating point types are wrapped with rounding
        if (this.nonFloatingPointType) {
            builder.add('(');
        }
        this.left.visit(builder);
        builder.add(" " + this.node.operator + " ");
        this.right.visit(builder);
        if (this.nonFloatingPointType) {
            builder.add('|0)');
        }
    };
    return InfixExpressionVisitor;
}(BaseExpression));
exports.InfixExpressionVisitor = InfixExpressionVisitor;
var PrefixExpressionVisitor = (function (_super) {
    __extends(PrefixExpressionVisitor, _super);
    function PrefixExpressionVisitor(parent, node) {
        _super.call(this, parent, node, 'PrefixExpression');
        this.operand = ExpressionFactory_1.default.create(this, this.node.operand);
        this.returnType = this.operand.returnType;
    }
    PrefixExpressionVisitor.prototype.visit = function (builder) {
        builder.add(this.node.operator, this.location);
        this.operand.visit(builder);
        return this;
    };
    return PrefixExpressionVisitor;
}(BaseExpression));
exports.PrefixExpressionVisitor = PrefixExpressionVisitor;
var PostfixExpressionVisitor = (function (_super) {
    __extends(PostfixExpressionVisitor, _super);
    function PostfixExpressionVisitor(parent, node) {
        _super.call(this, parent, node, 'PostfixExpression');
        this.operand = ExpressionFactory_1.default.create(this, this.node.operand);
        this.returnType = this.operand.returnType;
    }
    PostfixExpressionVisitor.prototype.visit = function (builder) {
        this.operand.visit(builder);
        builder.add(this.node.operator, this.location);
        return this;
    };
    return PostfixExpressionVisitor;
}(BaseExpression));
exports.PostfixExpressionVisitor = PostfixExpressionVisitor;
var ParenthesizedExpressionVisitor = (function (_super) {
    __extends(ParenthesizedExpressionVisitor, _super);
    function ParenthesizedExpressionVisitor(parent, node) {
        _super.call(this, parent, node, 'ParenthesizedExpression');
        this.expression = ExpressionFactory_1.default.create(this, this.node.expression);
        this.returnType = this.expression.returnType;
    }
    ParenthesizedExpressionVisitor.prototype.visit = function (builder) {
        builder.add('(');
        this.expression.visit(builder);
        builder.add(')');
    };
    return ParenthesizedExpressionVisitor;
}(BaseExpression));
exports.ParenthesizedExpressionVisitor = ParenthesizedExpressionVisitor;
var BooleanLiteralVisitor = (function (_super) {
    __extends(BooleanLiteralVisitor, _super);
    function BooleanLiteralVisitor(parent, node) {
        _super.call(this, parent, node, 'BooleanLiteral');
        this.returnType = 'boolean';
    }
    BooleanLiteralVisitor.prototype.visit = function (builder) {
        builder.add(this.node.booleanValue, this.location);
    };
    return BooleanLiteralVisitor;
}(BaseExpression));
exports.BooleanLiteralVisitor = BooleanLiteralVisitor;
var VariableReference = (function (_super) {
    __extends(VariableReference, _super);
    function VariableReference() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(VariableReference.prototype, "returnType", {
        get: function () {
            if (this._returnType === undefined) {
                this.findType();
            }
            return this._returnType;
        },
        enumerable: true,
        configurable: true
    });
    VariableReference.prototype.findVariableInDeclaration = function (owner, name) {
        if (name === void 0) { name = this.name.name; }
        // method can either be on this type or on its superclass
        var variable = owner.variables.find(function (m) { return m.name.name === name; });
        if (variable) {
            this._returnType = variable.type.originalName;
            // it is either a direct parent or in the block underneath
            this.classVariable = owner.node.node === 'TypeDeclaration' || owner.parent.node.node === 'TypeDeclaration';
            // if it is a classs variable it can be static
            if (variable.isStatic) {
                // finf the compilation name
                var type = this.findParent('TypeDeclaration');
                this.staticOwner = type.name.name;
            }
        }
        return variable;
    };
    VariableReference.prototype.findTypeInParent = function (parent) {
        if (this._returnType) {
            return;
        }
        // find if name exists in the parent scope
        var vh = parent;
        if (vh.variables && vh.variables.length) {
            if (this.findVariableInDeclaration(vh)) {
                return;
            }
        }
        if (parent.parent) {
            this.findTypeInParent(parent.parent);
        }
        else {
            // we are in a compilation unit
            // let cu = parent as ICompilationUnitVisitor;
            // for (let type of cu.declarations) {
            //   this.findType
            // }
            throw new Error('Did not find variable: ' + this.name.name);
        }
    };
    VariableReference.prototype.findType = function () {
        return this.findTypeInParent(this.parent);
    };
    VariableReference.prototype.visit = function (builder) {
        // find the type and detect whether it is a class variable
        this.findType();
        // render this. if it is a class member
        if (this.staticOwner) {
            builder.add(this.staticOwner + '.');
        }
        else if (this.classVariable) {
            builder.add('this.');
        }
        // render name
        this.name.visit(builder);
    };
    return VariableReference;
}(BaseExpression));
exports.VariableReference = VariableReference;
var SimpleVariableReference = (function (_super) {
    __extends(SimpleVariableReference, _super);
    function SimpleVariableReference(parent, node) {
        _super.call(this, parent, node, 'SimpleName');
        this.name = NameFactory_1.default.create(this, node);
    }
    return SimpleVariableReference;
}(VariableReference));
exports.SimpleVariableReference = SimpleVariableReference;
var QualifiedVariableReference = (function (_super) {
    __extends(QualifiedVariableReference, _super);
    function QualifiedVariableReference(parent, node) {
        _super.call(this, parent, node, 'QualifiedName');
        this.name = NameFactory_1.default.create(this, node.name);
        this.qualifier = ExpressionFactory_1.default.create(this, node.qualifier);
    }
    QualifiedVariableReference.prototype.findType = function () {
        // find the parent field
        // use field access to access all child properties
        var q = this.qualifier;
        while (q.qualifier) {
            q = q.qualifier;
        }
        // q is the primary qualifier
        // 1. we search for it first in the hierarchy
        // 2. in the list of all compilation units' type declarations
        var owner = this.findTypeInParent;
        return this.findTypeInParent(this.parent);
    };
    return QualifiedVariableReference;
}(VariableReference));
exports.QualifiedVariableReference = QualifiedVariableReference;
var MethodInvocationVisitor = (function (_super) {
    __extends(MethodInvocationVisitor, _super);
    function MethodInvocationVisitor(parent, node) {
        _super.call(this, parent, node, 'MethodInvocation');
        this.name = NameFactory_1.default.create(this, node.name);
        this.arguments = ExpressionFactory_1.default.createArray(this, node.arguments);
        if (node.expression) {
            this.expression = ExpressionFactory_1.default.create(this, node.expression);
        }
        this.typeArguments = new TypeParameterVisitor_1.default(this, node.typeArguments);
    }
    MethodInvocationVisitor.prototype.findTypeInTypeDeclaration = function (owner) {
        var _this = this;
        // method can either be on this type or on its superclass
        var method = owner.methods.find(function (m) { return m.name.name === _this.name.name; });
        if (method) {
            this._returnType = method.returnType.originalName;
        }
        return method;
    };
    MethodInvocationVisitor.prototype.findType = function () {
        // browse till type declaration and find the return type of this method
        var owner = this.findParent('TypeDeclaration');
        var method = this.findTypeInTypeDeclaration(owner);
        if (!method) {
            // check all supertypes
            var cu = this.findParent('CompilationUnit');
        }
        if (!method) {
            this.addError(Messages_1.default.Errors.MethodNotFound, this.name.name);
            throw new Error(Messages_1.default.Errors.MethodNotFound(this.name.name));
        }
    };
    Object.defineProperty(MethodInvocationVisitor.prototype, "returnType", {
        get: function () {
            if (this._returnType === undefined) {
                this.findType();
            }
            return this._returnType;
        },
        enumerable: true,
        configurable: true
    });
    MethodInvocationVisitor.prototype.visit = function (builder) {
        this.findType();
        if (this.expression) {
            this.expression.visit(builder);
            builder.add('.');
        }
        this.name.visit(builder);
        builder.add('(');
        builder.join(this.arguments, ',');
        builder.add(')');
    };
    return MethodInvocationVisitor;
}(BaseExpression));
exports.MethodInvocationVisitor = MethodInvocationVisitor;
var ExpressionStatementVisitor = (function (_super) {
    __extends(ExpressionStatementVisitor, _super);
    function ExpressionStatementVisitor(parent, node) {
        _super.call(this, parent, node, 'ExpressionStatement');
        this.expression = ExpressionFactory_1.default.create(this, node.expression);
    }
    ExpressionStatementVisitor.prototype.visit = function (builder) {
        this.expression.visit(builder);
        builder.add(';');
    };
    return ExpressionStatementVisitor;
}(Visitor_1.default));
exports.ExpressionStatementVisitor = ExpressionStatementVisitor;
var FieldAccessVisitor = (function (_super) {
    __extends(FieldAccessVisitor, _super);
    function FieldAccessVisitor(parent, node) {
        _super.call(this, parent, node, 'FieldAccess');
        this.name = NameFactory_1.default.create(this, node.name);
        this.expression = ExpressionFactory_1.default.create(this, node.expression);
    }
    FieldAccessVisitor.prototype.visit = function (builder) {
        // TODO: find return type and check expression a() / b() or assignment to variable
        this.expression.visit(builder);
        builder.add('.');
        this.name.visit(builder);
    };
    return FieldAccessVisitor;
}(BaseExpression));
exports.FieldAccessVisitor = FieldAccessVisitor;
var ThisExpressionVisitor = (function (_super) {
    __extends(ThisExpressionVisitor, _super);
    function ThisExpressionVisitor(parent, node) {
        _super.call(this, parent, node, 'ThisExpression');
    }
    ThisExpressionVisitor.prototype.visit = function (builder) {
        builder.add('this');
    };
    return ThisExpressionVisitor;
}(Visitor_1.default));
exports.ThisExpressionVisitor = ThisExpressionVisitor;
var SuperFieldAccessVisitor = (function (_super) {
    __extends(SuperFieldAccessVisitor, _super);
    function SuperFieldAccessVisitor(parent, node) {
        _super.call(this, parent, node, 'SuperFieldAccess');
        this.name = NameFactory_1.default.create(this, node.name);
    }
    SuperFieldAccessVisitor.prototype.visit = function (builder) {
        builder.add('super.');
        this.name.visit(builder);
    };
    return SuperFieldAccessVisitor;
}(Visitor_1.default));
exports.SuperFieldAccessVisitor = SuperFieldAccessVisitor;
