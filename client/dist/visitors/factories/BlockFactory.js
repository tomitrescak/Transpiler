"use strict";
var VariableDeclarationStatementVisitor_1 = require('../VariableDeclarationStatementVisitor');
var ExpressionsVisitors_1 = require('../ExpressionsVisitors');
var BlockVisitor_1 = require('../BlockVisitor');
var Statements = require('../StatementsVisitor');
var BlockFactory = (function () {
    function BlockFactory() {
    }
    BlockFactory.create = function (parent, node) {
        if (node.node === 'Block') {
            return new BlockVisitor_1.BlockVisitor(parent, node);
        }
        else if (node.node === 'VariableDeclarationStatement') {
            return new VariableDeclarationStatementVisitor_1.default(parent, node);
        }
        else if (node.node === 'ExpressionStatement') {
            return new ExpressionsVisitors_1.ExpressionStatementVisitor(parent, node);
        }
        else if (node.node === 'IfStatement') {
            return new Statements.IfStatementVisitor(parent, node);
        }
        else {
            throw new Error('Unsupported node: ' + node.node);
        }
    };
    BlockFactory.createArray = function (parent, node) {
        return node.map(function (a) { return BlockFactory.create(parent, a); });
    };
    return BlockFactory;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlockFactory;
