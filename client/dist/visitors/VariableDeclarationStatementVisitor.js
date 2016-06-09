"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FieldDeclarationVisitor_1 = require('./FieldDeclarationVisitor');
var ModifiersVisitor_1 = require('./ModifiersVisitor');
var VariableDeclarationStatementVisitor = (function (_super) {
    __extends(VariableDeclarationStatementVisitor, _super);
    function VariableDeclarationStatementVisitor(parent, node) {
        _super.call(this, parent, node, 'VariableDeclarationStatement');
        // reinit modifiers
        this.modifiers = new ModifiersVisitor_1.default(this, node.modifiers, [], ModifiersVisitor_1.ModifierLevel.Variable);
    }
    VariableDeclarationStatementVisitor.prototype.visit = function (builder) {
        if (this.modifiers.isFinal) {
            builder.add('const ');
        }
        else {
            builder.add('let ');
        }
        _super.prototype.visit.call(this, builder);
    };
    return VariableDeclarationStatementVisitor;
}(FieldDeclarationVisitor_1.default));
exports.VariableDeclarationStatementVisitor = VariableDeclarationStatementVisitor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VariableDeclarationStatementVisitor;
