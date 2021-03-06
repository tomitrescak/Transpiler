"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var NumberLiteralVisitor = (function (_super) {
    __extends(NumberLiteralVisitor, _super);
    function NumberLiteralVisitor() {
        _super.apply(this, arguments);
    }
    NumberLiteralVisitor.prototype.visit = function (node) {
        _super.prototype.check.call(this, node, 'NumberLiteral');
        return node.token;
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
        return '';
    };
    return InfixExpressionVisitor;
}(Visitor_1.default));
exports.InfixExpressionVisitor = InfixExpressionVisitor;
