"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var ExpressionFactory_1 = require('./factories/ExpressionFactory');
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
        throw new Error("Not implemented ..");
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
        var left = ExpressionFactory_1.default.create(this, this.node.leftOperand);
        var right = ExpressionFactory_1.default.create(this, this.node.rightOperand);
        // detect the return type for numbers
        if (this.node.operator === '+' && (left.returnType === 'string' || right.returnType === 'string')) {
            this.returnType = 'string';
        }
        var lidx = order.indexOf(left.returnType);
        var ridx = order.indexOf(right.returnType);
        // return type is the one which has bigger priority
        if (lidx > -1 && lidx > -1) {
            if (lidx < ridx) {
                this.returnType = right.returnType;
            }
            else {
                this.returnType = left.returnType;
            }
            // round non float types from long lower (idx of long is 4)
            if (lidx < 4 && ridx < 4 && this.node.operator === '/') {
                this.nonFloatingPointType = true;
            }
        }
        this.left = left;
        this.right = right;
    }
    InfixExpressionVisitor.prototype.visit = function (builder) {
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
