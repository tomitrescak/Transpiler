"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var Builder_1 = require('../config/Builder');
var NumberLiteralVisitor = (function (_super) {
    __extends(NumberLiteralVisitor, _super);
    function NumberLiteralVisitor() {
        _super.apply(this, arguments);
    }
    NumberLiteralVisitor.prototype.visit = function (node) {
        _super.prototype.check.call(this, node, 'NumberLiteral');
        Builder_1.default.add(node.token, node);
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
    };
    return InfixExpressionVisitor;
}(Visitor_1.default));
exports.InfixExpressionVisitor = InfixExpressionVisitor;
var ExpressionVisitor = (function () {
    function ExpressionVisitor() {
    }
    ExpressionVisitor.visit = function (parent, node) {
        switch (node.node) {
            case 'NumberLiteral':
                new NumberLiteralVisitor(parent).visit(node);
                break;
            case 'InfixExpression':
                new InfixExpressionVisitor(parent).visit(node);
                break;
            default:
                throw new Error(node.node + ' is not implemented');
        }
    };
    return ExpressionVisitor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExpressionVisitor;
