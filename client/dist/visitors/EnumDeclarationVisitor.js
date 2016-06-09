"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var NameFactory_1 = require('./factories/NameFactory');
var ModifiersVisitor_1 = require('./ModifiersVisitor');
var Messages_1 = require('../config/Messages');
var EnumConstantDeclarationVisitor = (function (_super) {
    __extends(EnumConstantDeclarationVisitor, _super);
    function EnumConstantDeclarationVisitor(parent, node) {
        _super.call(this, parent, node, 'EnumConstantDeclaration');
        if (node.arguments.length) {
            this.addError(Messages_1.default.Errors.SimpleEnumsOnlySupported);
        }
        this.name = NameFactory_1.default.create(this, node.name).name;
    }
    EnumConstantDeclarationVisitor.prototype.visit = function (builder) {
        builder.pad(this.indent);
        builder.add(this.name);
    };
    return EnumConstantDeclarationVisitor;
}(Visitor_1.default));
var EnumDeclarationVisitor = (function (_super) {
    __extends(EnumDeclarationVisitor, _super);
    function EnumDeclarationVisitor(parent, node) {
        _super.call(this, parent, node, 'EnumDeclaration');
        // validate
        if (this.node.bodyDeclarations.length) {
            this.addError(Messages_1.default.Errors.SimpleEnumsOnlySupported);
            return;
        }
    }
    EnumDeclarationVisitor.prototype.visit = function (builder) {
        var _this = this;
        var node = this.node;
        var constants = node.enumConstants.map(function (c) { return new EnumConstantDeclarationVisitor(_this, c); });
        var modifiers = new ModifiersVisitor_1.default(this, node.modifiers, [], ModifiersVisitor_1.ModifierLevel.Class);
        var name = NameFactory_1.default.create(this, node.name).name;
        // pad from left
        builder.pad(this.indent);
        // increase padding for child elements
        this.incIndent();
        // add modifiers
        modifiers.visit(builder);
        // add descriptors
        builder.add('enum ');
        // add name
        builder.add(name);
        // add all constants and surround them with brackets
        builder.add(' {');
        builder.addLine();
        builder.join(constants, ',\n');
        builder.addLine();
        builder.pad(this.parent.indent);
        builder.add('}');
        builder.addLine();
    };
    return EnumDeclarationVisitor;
}(Visitor_1.default));
exports.EnumDeclarationVisitor = EnumDeclarationVisitor;
