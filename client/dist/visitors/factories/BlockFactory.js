"use strict";
var VariableDeclarationStatementVisitor_1 = require('../VariableDeclarationStatementVisitor');
var ExpressionsVisitors_1 = require('../ExpressionsVisitors');
var BlockVisitor_1 = require('../BlockVisitor');
var Statements = require('../StatementsVisitor');
var BlockFactory = (function () {
    function BlockFactory() {
    }
    BlockFactory.create = function (parent, node) {
        switch (node.node) {
            case 'Block':
                return new BlockVisitor_1.BlockVisitor(parent, node);
            case 'VariableDeclarationStatement':
                return new VariableDeclarationStatementVisitor_1.default(parent, node);
            case 'ExpressionStatement':
                return new ExpressionsVisitors_1.ExpressionStatementVisitor(parent, node);
            case 'IfStatement':
                return new Statements.IfStatementVisitor(parent, node);
            case 'WhileStatement':
                return new Statements.WhileStatementVisitor(parent, node);
            case 'SwitchStatement':
                return new Statements.SwitchStatementVisitor(parent, node);
            case 'SwitchCase':
                return new Statements.SwitchCaseVisitor(parent, node);
            case 'BreakStatement':
                return new Statements.BreakStatementVisitor(parent, node);
            case 'ContinueStatement':
                return new Statements.ContinueStatementVisitor(parent, node);
            case 'ReturnStatement':
                return new Statements.ReturnStatementVisitor(parent, node);
            case 'TryStatement':
                return new Statements.TryStatementVisitor(parent, node);
            case 'CatchClause':
                return new Statements.CatchClauseVisitor(parent, node);
            default:
                throw new Error('Unsupported block statement: ' + node.node);
        }
    };
    BlockFactory.createArray = function (parent, node) {
        return node.map(function (a) { return BlockFactory.create(parent, a); });
    };
    return BlockFactory;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlockFactory;
