"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var BlockFactory_1 = require('./factories/BlockFactory');
var BlockVisitor = (function (_super) {
    __extends(BlockVisitor, _super);
    function BlockVisitor(parent, node) {
        _super.call(this, parent, node, 'Block');
        if (node.statements.length) {
            this.statements = BlockFactory_1.default.createArray(parent, node.statements);
        }
    }
    BlockVisitor.prototype.visit = function (builder) {
        this.incIndent();
        builder.add('{');
        if (this.node.statements.length) {
            builder.addLine();
            builder.pad(this.indent);
            builder.join(this.statements, '\n');
            builder.pad(this.parent.indent);
        }
        builder.add('}\n');
    };
    return BlockVisitor;
}(Visitor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlockVisitor;
