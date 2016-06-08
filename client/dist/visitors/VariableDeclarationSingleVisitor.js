"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ModifiersVisitor_1 = require('./ModifiersVisitor');
var VariableDeclarationFragmentVisitor_1 = require('./VariableDeclarationFragmentVisitor');
var SingleVariableDeclarationVisitor = (function (_super) {
    __extends(SingleVariableDeclarationVisitor, _super);
    function SingleVariableDeclarationVisitor(parent, node) {
        _super.call(this, parent, node, node.type, 'SingleVariableDeclaration');
        this.varargs = node.varargs;
        if (node.modifiers.length) {
            this.modifiers = new ModifiersVisitor_1.default(this, node.modifiers);
        }
    }
    SingleVariableDeclarationVisitor.prototype.visit = function (builder) {
        // render extra values specific for parameters
        if (this.modifiers) {
            this.modifiers.visit(builder);
            builder.add(' ');
        }
        if (this.varargs) {
            builder.add('...');
        }
        // render variable declaration without initialiser
        _super.prototype.visit.call(this, builder, false);
        // vararags add [] at the end
        if (this.varargs) {
            builder.add('[]');
        }
    };
    return SingleVariableDeclarationVisitor;
}(VariableDeclarationFragmentVisitor_1.default));
exports.SingleVariableDeclarationVisitor = SingleVariableDeclarationVisitor;
var SingleVariableDeclarationsVisitor = (function () {
    function SingleVariableDeclarationsVisitor(parent, params) {
        this.parameters = params.map(function (p) { return new SingleVariableDeclarationVisitor(parent, p); });
    }
    SingleVariableDeclarationsVisitor.prototype.visit = function (builder) {
        builder.join(this.parameters, ', ');
    };
    return SingleVariableDeclarationsVisitor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SingleVariableDeclarationsVisitor;
