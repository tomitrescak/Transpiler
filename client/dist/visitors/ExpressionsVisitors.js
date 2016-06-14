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
var TypeFactory_1 = require('./factories/TypeFactory');
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
var artihmeticOperators = ['<', '<=', '==', '!=', '>', '>='];
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
        var lidx = order.indexOf(left.returnType);
        var ridx = order.indexOf(right.returnType);
        // detect the return type for string
        if (this.node.operator === '+' && (left.returnType === 'string' || right.returnType === 'string')) {
            this._returnType = 'string';
        }
        else if (artihmeticOperators.indexOf(this.node.operator) >= 0) {
            // detect arithmetic operations
            this._returnType = 'boolean';
        }
        else if (lidx > -1 && ridx > -1) {
            // detect return type for numbers
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
        else {
            this._returnType = left.returnType;
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
        // type check that negation only works on booleans
        if (this.node.operator === '!') {
            if (this.operand.returnType !== 'boolean') {
                this.addError(Messages_1.default.Errors.TypeMismatch, this.operand.returnType, 'boolean');
            }
        }
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
            if (this.variable) {
                return this.variable.type.originalName;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VariableReference.prototype, "variable", {
        get: function () {
            if (this._variable === undefined) {
                this._variable = this.findVariable(this);
            }
            return this._variable;
        },
        enumerable: true,
        configurable: true
    });
    VariableReference.prototype.findVariable = function (parent) {
        // find variable in current parent
        return parent.findVariableInParent(parent, this.name.name);
    };
    VariableReference.prototype.visit = function (builder) {
        var variable = this.variable;
        if (variable) {
            // check whether it is a class variable
            this.classVariable =
                variable.parent.node.node !== 'MethodDeclaration' &&
                    (variable.parent.node.node === 'TypeDeclaration' ||
                        variable.parent.parent.node.node === 'TypeDeclaration');
            // check whether it is a static variable
            if (variable.isStatic || variable.isFinal) {
                // finf the compilation name
                var type = variable.owner;
                this.qualifierName = type.name.name;
            }
        }
        else if (!this.compilationUnit.findDeclaration(this.name.name)) {
            // we tried to get the symbol as a class name A.b from the compilation unit and we failed
            this.addError(Messages_1.default.Errors.SymbolNotFound, this.name.name);
        }
        // render this. if it is a class member
        if (this.qualifierName) {
            builder.add(this.qualifierName + '.');
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
    QualifiedVariableReference.prototype.findVariable = function (parent) {
        var type = this.findVariableType(this);
        // find type of the qualifier
        if (type) {
            return type.findField(this.name.name);
        }
        return null;
    };
    QualifiedVariableReference.prototype.visit = function (builder) {
        // render qualifier
        this.qualifier.visit(builder);
        // connect with the name
        builder.add('.');
        // render name
        this.name.visit(builder);
    };
    return QualifiedVariableReference;
}(VariableReference));
exports.QualifiedVariableReference = QualifiedVariableReference;
var MethodInvocationVisitor = (function (_super) {
    __extends(MethodInvocationVisitor, _super);
    function MethodInvocationVisitor(parent, node, nodeName) {
        if (nodeName === void 0) { nodeName = 'MethodInvocation'; }
        _super.call(this, parent, node, nodeName);
        this.name = NameFactory_1.default.create(this, node.name);
        this.arguments = ExpressionFactory_1.default.createArray(this, node.arguments);
        if (node.expression) {
            this.expression = ExpressionFactory_1.default.create(this, node.expression);
        }
        this.typeArguments = new TypeParameterVisitor_1.default(this, node.typeArguments);
    }
    Object.defineProperty(MethodInvocationVisitor.prototype, "method", {
        get: function () {
            if (!this._method) {
                var owner = this.owner;
                if (this.expression) {
                    owner = this.findVariableType(this.expression, 'qualifier', ['QualifiedName', 'MethodInvocation']);
                }
                // browse till type declaration and find the return type of this method
                if (owner) {
                    this._method = owner.findMethod(this.name.name);
                    // maybe the method is in the parent
                    if (!this._method) {
                        this._method = owner.findMethodInSuperClass(this.name.name);
                    }
                }
                else {
                    this.addError(Messages_1.default.Errors.SymbolNotFound, this.expression['name'].name);
                }
            }
            return this._method;
        },
        enumerable: true,
        configurable: true
    });
    MethodInvocationVisitor.prototype.findMethodTypeName = function () {
        if (this.method) {
            return this.method.returnType.originalName;
        }
        else {
            this.addError(Messages_1.default.Errors.MethodNotFound, this.name.name);
            return null;
        }
    };
    Object.defineProperty(MethodInvocationVisitor.prototype, "returnType", {
        get: function () {
            if (this._returnType === undefined) {
                this._returnType = this.findMethodTypeName();
            }
            return this._returnType;
        },
        enumerable: true,
        configurable: true
    });
    MethodInvocationVisitor.prototype.visit = function (builder) {
        // this.findMethodType();
        // if there is no expression (prefix) before the method
        // we either ad this. or static qualifier
        if (this.expression) {
            this.expression.visit(builder);
        }
        else {
            if (!this.method) {
                this.addError(Messages_1.default.Errors.MethodNotFound, this.name.name);
                return;
            }
            else if (this.method.modifiers.isStatic) {
                builder.add(this.method.owner.name.name);
            }
            else if (this.node.node === 'SuperMethodInvocation') {
                builder.add('super');
            }
            else {
                builder.add('this');
            }
        }
        builder.add('.');
        this.name.visit(builder);
        builder.add('(');
        builder.join(this.arguments, ',');
        builder.add(')');
    };
    return MethodInvocationVisitor;
}(BaseExpression));
exports.MethodInvocationVisitor = MethodInvocationVisitor;
var SuperMethodInvocationVisitor = (function (_super) {
    __extends(SuperMethodInvocationVisitor, _super);
    function SuperMethodInvocationVisitor(parent, node) {
        _super.call(this, parent, node, 'SuperMethodInvocation');
    }
    Object.defineProperty(SuperMethodInvocationVisitor.prototype, "method", {
        get: function () {
            if (!this._method) {
                this._method = this.owner.findMethodInSuperClass(this.name.name);
            }
            return this._method;
        },
        enumerable: true,
        configurable: true
    });
    SuperMethodInvocationVisitor.prototype.visit = function (builder) {
        _super.prototype.visit.call(this, builder);
    };
    return SuperMethodInvocationVisitor;
}(MethodInvocationVisitor));
exports.SuperMethodInvocationVisitor = SuperMethodInvocationVisitor;
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
    Object.defineProperty(FieldAccessVisitor.prototype, "returnType", {
        get: function () {
            if (this.variable) {
                return this.variable.type.originalName;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldAccessVisitor.prototype, "variable", {
        get: function () {
            if (this._variable === undefined) {
                this._variable = this.findVariable(this);
            }
            return this._variable;
        },
        enumerable: true,
        configurable: true
    });
    FieldAccessVisitor.prototype.findVariable = function (parent) {
        var type = this.findVariableType(this, 'expression', 'FieldAccess');
        // find type of the qualifier
        if (type) {
            var field = type.findField(this.name.name);
            if (!field) {
                this.addError(Messages_1.default.Errors.FieldNotFound, this.name.name, type.name.name);
            }
            return field;
        }
        return null;
    };
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
}(BaseExpression));
exports.ThisExpressionVisitor = ThisExpressionVisitor;
var SuperFieldAccessVisitor = (function (_super) {
    __extends(SuperFieldAccessVisitor, _super);
    function SuperFieldAccessVisitor(parent, node) {
        _super.call(this, parent, node, 'SuperFieldAccess');
        this.name = NameFactory_1.default.create(this, node.name);
    }
    Object.defineProperty(SuperFieldAccessVisitor.prototype, "returnType", {
        get: function () {
            var sup = this.findSuperClass();
            if (!sup) {
                this.addError(Messages_1.default.Errors.NoSuperClass);
            }
            var variable = sup.findField(this.name.name);
            if (!variable) {
                this.addError(Messages_1.default.Errors.VariableNotFound, this.name.name);
            }
            else {
                return variable.type.originalName;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    SuperFieldAccessVisitor.prototype.visit = function (builder) {
        builder.add('super.');
        this.name.visit(builder);
    };
    return SuperFieldAccessVisitor;
}(BaseExpression));
exports.SuperFieldAccessVisitor = SuperFieldAccessVisitor;
var AssignmentVisitor = (function (_super) {
    __extends(AssignmentVisitor, _super);
    function AssignmentVisitor(parent, node) {
        _super.call(this, parent, node, 'Assignment');
        this.leftHandSide = ExpressionFactory_1.default.create(this, node.leftHandSide);
        this.rightHandSide = ExpressionFactory_1.default.create(this, node.rightHandSide);
        this.operator = node.operator;
    }
    Object.defineProperty(AssignmentVisitor.prototype, "returnType", {
        get: function () {
            return this.rightHandSide.returnType;
        },
        enumerable: true,
        configurable: true
    });
    AssignmentVisitor.prototype.visit = function (builder) {
        // try to get the variable from the left side
        var variable = this.leftHandSide['variable'];
        if (variable) {
            // check assignment to a constant
            if (variable.isFinal) {
                this.addError(Messages_1.default.Errors.ConstantAssignment);
            }
        }
        var leftType = this.leftHandSide.returnType;
        var rightType = this.rightHandSide.returnType;
        this.checkAssignment(leftType, rightType);
        this.leftHandSide.visit(builder);
        builder.add(' ' + this.operator + ' ');
        this.rightHandSide.visit(builder);
    };
    return AssignmentVisitor;
}(BaseExpression));
exports.AssignmentVisitor = AssignmentVisitor;
var ArrayInitializerVisitor = (function (_super) {
    __extends(ArrayInitializerVisitor, _super);
    function ArrayInitializerVisitor(parent, node) {
        _super.call(this, parent, node, 'ArrayInitializer');
    }
    Object.defineProperty(ArrayInitializerVisitor.prototype, "returnType", {
        get: function () {
            return 'Array';
        },
        enumerable: true,
        configurable: true
    });
    ArrayInitializerVisitor.prototype.visit = function (builder) {
        builder.add('[');
        builder.join(ExpressionFactory_1.default.createArray(this, this.node.expressions), ',');
        builder.add(']');
    };
    return ArrayInitializerVisitor;
}(BaseExpression));
exports.ArrayInitializerVisitor = ArrayInitializerVisitor;
var ClassInstanceCreationVisitor = (function (_super) {
    __extends(ClassInstanceCreationVisitor, _super);
    function ClassInstanceCreationVisitor(parent, node) {
        _super.call(this, parent, node, 'ClassInstanceCreation');
        this.type = TypeFactory_1.default.create(this, node.type);
        if (node.expression) {
            this.addError(Messages_1.default.Errors.ContructorExpressionNotSupported, JSON.stringify(node.expression));
        }
        if (node.typeArguments.length) {
            this.addError(Messages_1.default.Errors.ConstructorTypeArgumentsNotSupported);
        }
    }
    Object.defineProperty(ClassInstanceCreationVisitor.prototype, "returnType", {
        get: function () {
            return this.type.originalName;
        },
        enumerable: true,
        configurable: true
    });
    ClassInstanceCreationVisitor.prototype.visit = function (builder) {
        // new keyword
        builder.add('new ');
        // type initialiser
        this.type.visit(builder);
        builder.add('(');
        if (this.node.arguments.length) {
            var args = ExpressionFactory_1.default.createArray(this, this.node.arguments);
            builder.join(args, ', ');
        }
        builder.add(')');
    };
    return ClassInstanceCreationVisitor;
}(Visitor_1.default));
exports.ClassInstanceCreationVisitor = ClassInstanceCreationVisitor;
