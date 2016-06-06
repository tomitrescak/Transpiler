"use strict";
var Expressions = require('../ExpressionsVisitors');
var NameFactory_1 = require('./NameFactory');
var ExpressionVisitor = (function () {
    function ExpressionVisitor() {
    }
    ExpressionVisitor.create = function (parent, node) {
        switch (node.node) {
            case 'SimpleName':
            case 'QualifiedName':
                return NameFactory_1.default.create(parent, node);
            case 'PrefixExpression':
                return new Expressions.PrefixExpressionVisitor(parent, node);
            case 'BooleanLiteral':
                return new Expressions.BooleanLiteralVisitor(parent, node);
            case 'NumberLiteral':
                return new Expressions.NumberLiteralVisitor(parent, node);
            case 'InfixExpression':
                return new Expressions.InfixExpressionVisitor(parent, node);
            case 'ParenthesizedExpression':
                return new Expressions.ParenthesizedExpressionVisitor(parent, node);
            default:
                throw new Error(node.node + ' is not implemented');
        }
    };
    return ExpressionVisitor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExpressionVisitor;
