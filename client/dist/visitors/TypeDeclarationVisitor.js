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
var TypeDeclarationsVisitor = (function (_super) {
    __extends(TypeDeclarationsVisitor, _super);
    function TypeDeclarationsVisitor() {
        _super.apply(this, arguments);
    }
    TypeDeclarationsVisitor.prototype.visit = function (types) {
        var _this = this;
        Builder_1.default.join(types, function (type) { return new TypeDeclarationVisitor(_this.parent).visit(type); }, '\n');
    };
    return TypeDeclarationsVisitor;
}(Visitor_1.default));
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
        var pad = Builder_1.default.add(this.parent.pad());
        // add modifiers
        new ModifiersVisitor_1.ModifiersVisitor(this).visit(node.modifiers, ['abstract'], ['static']);
        // add descriptors
        Builder_1.default.add(node.interface ? 'interface ' : 'class ');
        // add name
        new NameVisitor_1.default(this).visit(node.name);
        // add type parameters
        new TypeParameterVisitor_1.TypeParametersVisitor(this).visit(node.typeParameters);
        // add superclass
        if (node.superClassType) {
            Builder_1.default.add(' extends ');
            new TypesVisitor_1.TypeVisitor(this).visit(node.superClassType);
        }
        // add interfaces
        if (node.superInterfaceTypes.length) {
            Builder_1.default.add(' implements ');
            new TypesVisitor_1.TypesVisitor(this).visit(node.superInterfaceTypes);
        }
        // visit all children
        if (node.bodyDeclarations.length) {
            // we append new line after the initial bracket '{\n'
            Builder_1.default.add(this.parent.pad() + ' {');
            Builder_1.default.addLine();
            // render children
            new BodyDeclarationsVisitor_1.default(this).visit(node.bodyDeclarations); // wrap children with new lines
            Builder_1.default.add(this.parent.pad() + '}');
            Builder_1.default.addLine();
        }
        else {
            Builder_1.default.add(' {}\n');
        }
    };
    return TypeDeclarationVisitor;
}(Visitor_1.default));
exports.TypeDeclarationVisitor = TypeDeclarationVisitor;
