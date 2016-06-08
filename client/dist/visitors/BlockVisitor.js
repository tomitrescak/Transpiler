"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var BlockVisitor = (function (_super) {
    __extends(BlockVisitor, _super);
    function BlockVisitor(parent, node) {
        _super.call(this, parent, node, 'Block');
    }
    BlockVisitor.prototype.visit = function (builder) {
        builder.add('{');
        if (this.node.statements.length) {
            builder.addLine();
            builder.pad(this.indent);
        }
        builder.add('}\n');
    };
    return BlockVisitor;
}(Visitor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlockVisitor;
