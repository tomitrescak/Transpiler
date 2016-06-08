"use strict";
var VariableDeclarationStatementVisitor_1 = require('../VariableDeclarationStatementVisitor');
var BlockFactory = (function () {
    function BlockFactory() {
    }
    BlockFactory.create = function (parent, node) {
        if (node.node === 'VariableDeclarationStatement') {
            return new VariableDeclarationStatementVisitor_1.default(parent, node);
        }
        else if (node.node === 'ExpressionStatement') {
            throw new Error('Unsupported node: ' + node.node);
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
