"use strict";
var Expressions = require('../ExpressionsVisitors');
var ExpressionFactory = (function () {
    function ExpressionFactory() {
    }
    ExpressionFactory.create = function (parent, node) {
        switch (node.node) {
            case 'SimpleName':
                return new Expressions.SimpleVariableReference(parent, node);
            case 'QualifiedName':
                return new Expressions.QualifiedVariableReference(parent, node);
            case 'PrefixExpression':
                return new Expressions.PrefixExpressionVisitor(parent, node);
            case 'PostfixExpression':
                return new Expressions.PostfixExpressionVisitor(parent, node);
            case 'BooleanLiteral':
                return new Expressions.BooleanLiteralVisitor(parent, node);
            case 'StringLiteral':
                return new Expressions.StringLiteralVisitor(parent, node);
            case 'CharacterLiteral':
                return new Expressions.CharacterLiteralVisitor(parent, node);
            case 'NumberLiteral':
                return new Expressions.NumberLiteralVisitor(parent, node);
            case 'InfixExpression':
                return new Expressions.InfixExpressionVisitor(parent, node);
            case 'ParenthesizedExpression':
                return new Expressions.ParenthesizedExpressionVisitor(parent, node);
            case 'MethodInvocation':
                return new Expressions.MethodInvocationVisitor(parent, node);
            case 'FieldAccess':
                return new Expressions.FieldAccessVisitor(parent, node);
            default:
                throw new Error(node.node + ' is not implemented');
        }
    };
    ExpressionFactory.createArray = function (parent, node) {
        //console.log(parent)
        return node.map(function (e) { return ExpressionFactory.create(parent, e); });
    };
    return ExpressionFactory;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExpressionFactory;
