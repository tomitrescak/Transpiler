"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var ModifiersVisitor_1 = require('./ModifiersVisitor');
var NameVisitor_1 = require('./NameVisitor');
var TypeParameterVisitor_1 = require('./TypeParameterVisitor');
var TypesVisitor_1 = require('./TypesVisitor');
var BodyDeclareationsVisitor_1 = require('./BodyDeclareationsVisitor');
var TypeDeclarationsVisitor = (function (_super) {
    __extends(TypeDeclarationsVisitor, _super);
    function TypeDeclarationsVisitor() {
        _super.apply(this, arguments);
    }
    TypeDeclarationsVisitor.prototype.visit = function (types) {
        var _this = this;
        return types.map(function (type) { return new TypeDeclarationVisitor(_this.parent).visit(type); }).join('\n');
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
        // assign source map
        Visitor_1.default.sourceMap.setLine(node);
        // increase padding
        this.incIndent();
        // visit all children
        var children = '';
        if (node.bodyDeclarations.length) {
            // we append new line after the initial bracket '{\n'
            children = '\n';
            // let sourcemap know
            Visitor_1.default.sourceMap.inc();
            // render children
            children += new BodyDeclareationsVisitor_1.default(this).visit(node.bodyDeclarations); // wrap children with new lines
        }
        var modifiers = node.modifiers ? new ModifiersVisitor_1.ModifiersVisitor(this).visit(node.modifiers, ['abstract'], ['static']) : '';
        var declarationType = node.interface ? 'interface' : 'class';
        var name = new NameVisitor_1.default(this).visit(node.name);
        var typeParameters = node.typeParameters ? new TypeParameterVisitor_1.TypeParametersVisitor(this).visit(node.typeParameters) : '';
        var superClass = node.superClassType ? (' extends ' + new TypesVisitor_1.TypeVisitor(this).visit(node.superClassType)) : '';
        var superInterfaceTypes = node.superInterfaceTypes.length ? (' implements ' + new TypesVisitor_1.TypesVisitor(this).visit(node.superInterfaceTypes)) : '';
        // the type declaration edns with a new line
        Visitor_1.default.sourceMap.inc();
        /**
         * abstract class Foo<M extends T> extends Bar implements IBar, IMar
         */
        return "" + this.parent.pad() + modifiers + declarationType + " " + name + typeParameters + superClass + superInterfaceTypes + " {" + children + "}\n";
    };
    return TypeDeclarationVisitor;
}(Visitor_1.default));
exports.TypeDeclarationVisitor = TypeDeclarationVisitor;
