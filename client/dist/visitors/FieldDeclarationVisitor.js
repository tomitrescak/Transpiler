"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var DeclarationsFactory_1 = require('./factories/DeclarationsFactory');
var ModifiersVisitor_1 = require('./ModifiersVisitor');
var FieldDeclarationVisitor = (function (_super) {
    __extends(FieldDeclarationVisitor, _super);
    function FieldDeclarationVisitor(parent, node) {
        _super.call(this, parent, node, 'FieldDeclaration');
    }
    FieldDeclarationVisitor.prototype.visit = function (builder) {
        var modifiers = new ModifiersVisitor_1.default(this, this.node.modifiers);
        var fragments = DeclarationsFactory_1.default.createArray(this, this.node.fragments, this.node.type);
        modifiers.visit(builder);
        builder.join(fragments, ';\n');
        builder.add(';\n');
    };
    return FieldDeclarationVisitor;
}(Visitor_1.default));
exports.FieldDeclarationVisitor = FieldDeclarationVisitor;
// export default class FieldDeclarationsVisitor extends Visitor {
//   visit(types: FieldDeclaration[]): string {
//     return types.map((type) => new FieldDeclarationVisitor(this.parent).visit(type)).join();
//   }
// }
// fragments
