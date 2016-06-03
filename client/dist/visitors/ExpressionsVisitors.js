"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var Builder_1 = require('../config/Builder');
var NameVisitor_1 = require('./NameVisitor');
var NumberLiteralVisitor = (function (_super) {
    __extends(NumberLiteralVisitor, _super);
    function NumberLiteralVisitor() {
        _super.apply(this, arguments);
    }
    NumberLiteralVisitor.prototype.visit = function (node) {
        _super.prototype.check.call(this, node, 'NumberLiteral');
        Builder_1.default.add(node.token, node);
        return this;
    };
    return NumberLiteralVisitor;
}(Visitor_1.default));
exports.NumberLiteralVisitor = NumberLiteralVisitor;
var InfixExpressionVisitor = (function (_super) {
    __extends(InfixExpressionVisitor, _super);
    function InfixExpressionVisitor() {
        _super.apply(this, arguments);
    }
    InfixExpressionVisitor.prototype.visit = function (node) {
        _super.prototype.check.call(this, node, 'InfixExpression');
        ExpressionVisitor.visit(this, node.leftOperand);
        Builder_1.default.add(' ' + node.operator + ' ');
        ExpressionVisitor.visit(this, node.rightOperand);
        return this;
    };
    return InfixExpressionVisitor;
}(Visitor_1.default));
exports.InfixExpressionVisitor = InfixExpressionVisitor;
var PrefixExpressionVisitor = (function (_super) {
    __extends(PrefixExpressionVisitor, _super);
    function PrefixExpressionVisitor() {
        _super.apply(this, arguments);
    }
    PrefixExpressionVisitor.prototype.visit = function (node) {
        _super.prototype.check.call(this, node, 'PrefixExpression');
        Builder_1.default.add(node.operator);
        ExpressionVisitor.visit(this, node.operand);
        return this;
    };
    return PrefixExpressionVisitor;
}(Visitor_1.default));
exports.PrefixExpressionVisitor = PrefixExpressionVisitor;
var ParenthesizedExpressionVisitor = (function (_super) {
    __extends(ParenthesizedExpressionVisitor, _super);
    function ParenthesizedExpressionVisitor() {
        _super.apply(this, arguments);
    }
    ParenthesizedExpressionVisitor.prototype.visit = function (node) {
        _super.prototype.check.call(this, node, 'ParenthesizedExpression');
        Builder_1.default.add('(');
        ExpressionVisitor.visit(this, node.expression);
        Builder_1.default.add(')');
        return this;
    };
    return ParenthesizedExpressionVisitor;
}(Visitor_1.default));
exports.ParenthesizedExpressionVisitor = ParenthesizedExpressionVisitor;
var BooleanLiteralVisitor = (function (_super) {
    __extends(BooleanLiteralVisitor, _super);
    function BooleanLiteralVisitor() {
        _super.apply(this, arguments);
    }
    BooleanLiteralVisitor.prototype.visit = function (node) {
        _super.prototype.check.call(this, node, 'BooleanLiteral');
        Builder_1.default.add(node.booleanValue, node);
        return this;
    };
    return BooleanLiteralVisitor;
}(Visitor_1.default));
exports.BooleanLiteralVisitor = BooleanLiteralVisitor;
var ExpressionVisitor = (function () {
    function ExpressionVisitor() {
    }
    ExpressionVisitor.visit = function (parent, node) {
        switch (node.node) {
            case 'SimpleName':
            case 'QualifiedName':
                return NameVisitor_1.default.visit(parent, node);
            case 'PrefixExpression':
                return new PrefixExpressionVisitor(parent).visit(node);
            case 'BooleanLiteral':
                return new BooleanLiteralVisitor(parent).visit(node);
            case 'NumberLiteral':
                return new NumberLiteralVisitor(parent).visit(node);
            case 'InfixExpression':
                return new InfixExpressionVisitor(parent).visit(node);
            case 'ParenthesizedExpression':
                return new ParenthesizedExpressionVisitor(parent).visit(node);
            default:
                throw new Error(node.node + ' is not implemented');
        }
    };
    return ExpressionVisitor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExpressionVisitor;
