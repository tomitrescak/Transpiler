"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var ExpressionFactory_1 = require('./factories/ExpressionFactory');
var NumberLiteralVisitor = (function (_super) {
    __extends(NumberLiteralVisitor, _super);
    function NumberLiteralVisitor(parent, node) {
        _super.call(this, parent, node, 'NumberLiteral');
    }
    NumberLiteralVisitor.prototype.visit = function (builder) {
        builder.add(this.node.token, this.location);
    };
    return NumberLiteralVisitor;
}(Visitor_1.default));
exports.NumberLiteralVisitor = NumberLiteralVisitor;
var InfixExpressionVisitor = (function (_super) {
    __extends(InfixExpressionVisitor, _super);
    function InfixExpressionVisitor(parent, node) {
        _super.call(this, parent, node, 'InfixExpression');
    }
    InfixExpressionVisitor.prototype.visit = function (builder) {
        var left = ExpressionFactory_1.default.create(this, this.node.leftOperand);
        var right = ExpressionFactory_1.default.create(this, this.node.rightOperand);
        left.visit(builder);
        builder.add(' ' + this.node.operator + ' ');
        right.visit(builder);
    };
    return InfixExpressionVisitor;
}(Visitor_1.default));
exports.InfixExpressionVisitor = InfixExpressionVisitor;
var PrefixExpressionVisitor = (function (_super) {
    __extends(PrefixExpressionVisitor, _super);
    function PrefixExpressionVisitor(parent, node) {
        _super.call(this, parent, node, 'PrefixExpression');
    }
    PrefixExpressionVisitor.prototype.visit = function (builder) {
        var operand = ExpressionFactory_1.default.create(this, this.node.operand);
        builder.add(this.node.operator, this.location);
        operand.visit(builder);
        return this;
    };
    return PrefixExpressionVisitor;
}(Visitor_1.default));
exports.PrefixExpressionVisitor = PrefixExpressionVisitor;
var ParenthesizedExpressionVisitor = (function (_super) {
    __extends(ParenthesizedExpressionVisitor, _super);
    function ParenthesizedExpressionVisitor(parent, node) {
        _super.call(this, parent, node, 'ParenthesizedExpression');
    }
    ParenthesizedExpressionVisitor.prototype.visit = function (builder) {
        var expression = ExpressionFactory_1.default.create(this, this.node.expression);
        builder.add('(');
        expression.visit(builder);
        builder.add(')');
    };
    return ParenthesizedExpressionVisitor;
}(Visitor_1.default));
exports.ParenthesizedExpressionVisitor = ParenthesizedExpressionVisitor;
var BooleanLiteralVisitor = (function (_super) {
    __extends(BooleanLiteralVisitor, _super);
    function BooleanLiteralVisitor(parent, node) {
        _super.call(this, parent, node, 'BooleanLiteral');
    }
    BooleanLiteralVisitor.prototype.visit = function (builder) {
        builder.add(this.node.booleanValue, this.location);
    };
    return BooleanLiteralVisitor;
}(Visitor_1.default));
exports.BooleanLiteralVisitor = BooleanLiteralVisitor;
