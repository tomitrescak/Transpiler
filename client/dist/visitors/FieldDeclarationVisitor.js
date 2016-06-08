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
    function FieldDeclarationVisitor(parent, node, nodeName) {
        if (nodeName === void 0) { nodeName = 'FieldDeclaration'; }
        _super.call(this, parent, node, nodeName);
        this.modifiers = new ModifiersVisitor_1.default(this, this.node.modifiers);
        this.fragments = DeclarationsFactory_1.default.createArray(this, this.node.fragments, this.node.type);
    }
    FieldDeclarationVisitor.prototype.visit = function (builder) {
        this.modifiers.visit(builder);
        builder.join(this.fragments, ';\n' + this.pad());
        builder.add(';\n');
    };
    return FieldDeclarationVisitor;
}(Visitor_1.default));
exports.FieldDeclarationVisitor = FieldDeclarationVisitor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FieldDeclarationVisitor;
// export default class FieldDeclarationsVisitor extends Visitor {
//   visit(types: FieldDeclaration[]): string {
//     return types.map((type) => new FieldDeclarationVisitor(this.parent).visit(type)).join();
//   }
// }
// fragments
