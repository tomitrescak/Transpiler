"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VariableDeclarationFragmentVisitor_1 = require('./VariableDeclarationFragmentVisitor');
var NameFactory_1 = require('./factories/NameFactory');
var TypeFactory_1 = require('./factories/TypeFactory');
var BodyDeclarationsFactory_1 = require('./factories/BodyDeclarationsFactory');
var TypeParameterVisitor_1 = require('./TypeParameterVisitor');
var ModifiersVisitor_1 = require('./ModifiersVisitor');
var TypeDeclarationVisitor = (function (_super) {
    __extends(TypeDeclarationVisitor, _super);
    function TypeDeclarationVisitor(parent, node) {
        var _this = this;
        _super.call(this, parent, node, 'TypeDeclaration');
        this.methods = [];
        this.fields = [];
        this.variables = [];
        this.modifiers = new ModifiersVisitor_1.default(this, node.modifiers, ['abstract'], ModifiersVisitor_1.ModifierLevel.Class);
        this.typeDeclarationName = node.interface ? 'interface ' : 'class ';
        this.name = NameFactory_1.default.create(this, node.name);
        this.typeParameters = new TypeParameterVisitor_1.default(this, node.typeParameters);
        if (node.superclassType) {
            this.superClassType = TypeFactory_1.default.create(this, node.superclassType).name;
        }
        if (node.superInterfaceTypes.length) {
            this.superInterfaceTypes = node.superInterfaceTypes.map(function (i) { return TypeFactory_1.default.create(_this, i); });
        }
        if (node.bodyDeclarations.length) {
            this.bodyDeclarations = node.bodyDeclarations.map(function (b) { return BodyDeclarationsFactory_1.default.create(_this, b); });
        }
    }
    TypeDeclarationVisitor.prototype.findField = function (name) {
        return this.findVariable(name);
    };
    TypeDeclarationVisitor.prototype.findMethod = function (name) {
        return this.methods.find(function (m) { return m.name.name === name; });
    };
    TypeDeclarationVisitor.prototype.visit = function (builder) {
        // indent
        builder.pad(this.indent);
        // increase padding
        this.incIndent();
        // add modifiers (public / private ...)
        this.modifiers.visit(builder);
        // add descriptors (class / interface)
        builder.add(this.typeDeclarationName);
        // add name
        this.name.visit(builder);
        // add type parameters
        this.typeParameters.visit(builder);
        // add superclass
        if (this.superClassType) {
            builder.add(' extends ');
            builder.add(this.superClassType);
        }
        // add interfaces
        if (this.superInterfaceTypes) {
            builder.add(' implements ');
            builder.join(this.superInterfaceTypes, ', ');
        }
        // visit all children
        if (this.bodyDeclarations) {
            // we append new line after the initial bracket '{\n'
            builder.pad(this.parent.indent);
            builder.add(' {');
            builder.addLine();
            builder.pad(this.indent);
            // render children
            builder.join(this.bodyDeclarations, '\n' + this.pad()); // wrap children with new lines
            builder.addLine();
            builder.pad(this.parent.indent);
            builder.add('}');
            builder.addLine();
        }
        else {
            builder.add(' {}\n');
        }
    };
    return TypeDeclarationVisitor;
}(VariableDeclarationFragmentVisitor_1.VariableHolderVisitor));
exports.TypeDeclarationVisitor = TypeDeclarationVisitor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypeDeclarationVisitor;
