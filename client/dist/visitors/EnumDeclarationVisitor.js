"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var Builder_1 = require('../config/Builder');
var ModifiersVisitor_1 = require('./ModifiersVisitor');
var NameVisitor_1 = require('./NameVisitor');
var EnumConstantDeclarationVisitor = (function (_super) {
    __extends(EnumConstantDeclarationVisitor, _super);
    function EnumConstantDeclarationVisitor() {
        _super.apply(this, arguments);
    }
    EnumConstantDeclarationVisitor.prototype.visit = function (node) {
        Builder_1.default.pad(this.indent);
        NameVisitor_1.default.visit(this, node.name);
    };
    return EnumConstantDeclarationVisitor;
}(Visitor_1.default));
var EnumConstantDeclarationsVisitor = (function () {
    function EnumConstantDeclarationsVisitor() {
    }
    EnumConstantDeclarationsVisitor.visit = function (parent, nodes) {
        Builder_1.default.join(nodes, function (node) { return new EnumConstantDeclarationVisitor(parent).visit(node); }, ',\n');
    };
    return EnumConstantDeclarationsVisitor;
}());
var EnumDeclarationVisitor = (function (_super) {
    __extends(EnumDeclarationVisitor, _super);
    function EnumDeclarationVisitor() {
        _super.apply(this, arguments);
    }
    EnumDeclarationVisitor.prototype.visit = function (node) {
        // validate
        if (node.bodyDeclarations.length) {
            //Builder.addError(Builder.Errors.SimpleEnumsOnlySupported(), node.location);
            return;
        }
        // pad from left
        Builder_1.default.pad(this.indent);
        // increase padding for child elements
        this.incIndent();
        // add modifiers
        ModifiersVisitor_1.default.visit(this, node.modifiers, ['public', 'private', 'abstract'], []);
        // add descriptors
        Builder_1.default.add('enum ');
        // add name
        NameVisitor_1.default.visit(this, node.name);
        // add all constants and surround them with brackets
        Builder_1.default.add(' {');
        Builder_1.default.addLine();
        EnumConstantDeclarationsVisitor.visit(this, node.enumConstants);
        Builder_1.default.addLine();
        Builder_1.default.pad(this.parent.indent);
        Builder_1.default.add('}');
        Builder_1.default.addLine();
    };
    return EnumDeclarationVisitor;
}(Visitor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EnumDeclarationVisitor;
