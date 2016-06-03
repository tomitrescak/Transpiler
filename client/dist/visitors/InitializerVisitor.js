"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var ExpressionsVisitors_1 = require('./ExpressionsVisitors');
var InitialiserVisitor = (function (_super) {
    __extends(InitialiserVisitor, _super);
    function InitialiserVisitor() {
        _super.apply(this, arguments);
    }
    InitialiserVisitor.prototype.visit = function (node) {
        switch (node.node) {
            case 'NumberLiteral':
                return new ExpressionsVisitors_1.NumberLiteralVisitor(this).visit(node);
            case 'InfixExpression':
                return new ExpressionsVisitors_1.InfixExpressionVisitor(this).visit(node);
            default:
                throw new Error(node.node + ' is not implemented');
        }
    };
    return InitialiserVisitor;
}(Visitor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InitialiserVisitor;
