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
var TypeParameterVisitor_1 = require('./TypeParameterVisitor');
var TypesVisitor_1 = require('./TypesVisitor');
var BodyDeclarationsVisitor_1 = require('./BodyDeclarationsVisitor');
var EnumDeclarationVisitor_1 = require('./EnumDeclarationVisitor');
var TypeDeclarationsVisitor = (function () {
    function TypeDeclarationsVisitor() {
    }
    TypeDeclarationsVisitor.visit = function (parent, types) {
        Builder_1.default.join(types, function (type) {
            switch (type.node) {
                case 'TypeDeclaration':
                    return new TypeDeclarationVisitor(parent).visit(type);
                case 'EnumDeclaration':
                    return new EnumDeclarationVisitor_1.default(parent).visit(type);
                default:
                    throw new Error(type.node + ' is not implemented');
            }
        }, '\n');
    };
    return TypeDeclarationsVisitor;
}());
exports.TypeDeclarationsVisitor = TypeDeclarationsVisitor;
var TypeDeclarationVisitor = (function (_super) {
    __extends(TypeDeclarationVisitor, _super);
    function TypeDeclarationVisitor() {
        _super.apply(this, arguments);
    }
    TypeDeclarationVisitor.prototype.visit = function (node) {
        _super.prototype.check.call(this, node, 'TypeDeclaration');
        // increase padding
        this.incIndent();
        // render header
        Builder_1.default.pad(this.parent.indent);
        // add modifiers
        ModifiersVisitor_1.ModifiersVisitor.visit(this, node.modifiers, ['abstract'], ['public', 'protected', 'private', 'final']);
        // add descriptors
        Builder_1.default.add(node.interface ? 'interface ' : 'class ');
        // add name
        NameVisitor_1.default.visit(this, node.name);
        // add type parameters
        TypeParameterVisitor_1.TypeParametersVisitor.visit(this, node.typeParameters);
        // add superclass
        if (node.superClassType) {
            Builder_1.default.add(' extends ');
            TypesVisitor_1.TypeVisitor.visit(this, node.superClassType);
        }
        // add interfaces
        if (node.superInterfaceTypes.length) {
            Builder_1.default.add(' implements ');
            TypesVisitor_1.TypesVisitor.visit(this, node.superInterfaceTypes);
        }
        // visit all children
        if (node.bodyDeclarations.length) {
            // we append new line after the initial bracket '{\n'
            Builder_1.default.pad(this.parent.indent);
            Builder_1.default.add(' {');
            Builder_1.default.addLine();
            // render children
            new BodyDeclarationsVisitor_1.default(this).visit(node.bodyDeclarations); // wrap children with new lines
            Builder_1.default.pad(this.parent.indent);
            Builder_1.default.add('}');
            Builder_1.default.addLine();
        }
        else {
            Builder_1.default.add(' {}\n');
        }
    };
    return TypeDeclarationVisitor;
}(Visitor_1.default));
exports.TypeDeclarationVisitor = TypeDeclarationVisitor;
