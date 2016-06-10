"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VariableDeclarationFragmentVisitor_1 = require('./VariableDeclarationFragmentVisitor');
var BlockFactory_1 = require('./factories/BlockFactory');
var BlockVisitor = (function (_super) {
    __extends(BlockVisitor, _super);
    function BlockVisitor(parent, node) {
        _super.call(this, parent, node, 'Block');
        this.variables = [];
        if (node.statements.length) {
            this.statements = BlockFactory_1.default.createArray(this, node.statements);
        }
    }
    BlockVisitor.prototype.visit = function (builder) {
        this.incIndent();
        builder.add('{');
        if (this.node.statements.length) {
            builder.addLine();
            builder.pad(this.indent);
            builder.join(this.statements, '\n' + this.pad());
            builder.addLine();
            builder.pad(this.parent.indent);
        }
        builder.add('}');
    };
    return BlockVisitor;
}(VariableDeclarationFragmentVisitor_1.VariableHolderVisitor));
exports.BlockVisitor = BlockVisitor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlockVisitor;
