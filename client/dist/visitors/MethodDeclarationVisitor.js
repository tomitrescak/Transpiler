"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VariableDeclarationFragmentVisitor_1 = require('./VariableDeclarationFragmentVisitor');
var BlockVisitor_1 = require('./BlockVisitor');
var NameFactory_1 = require('./factories/NameFactory');
var TypeFactory_1 = require('./factories/TypeFactory');
var TypeParameterVisitor_1 = require('./TypeParameterVisitor');
var ModifiersVisitor_1 = require('./ModifiersVisitor');
var VariableDeclarationSingleVisitor_1 = require('./VariableDeclarationSingleVisitor');
var Messages_1 = require('../config/Messages');
var MethodDeclarationVisitor = (function (_super) {
    __extends(MethodDeclarationVisitor, _super);
    function MethodDeclarationVisitor(parent, node) {
        var _this = this;
        _super.call(this, parent, node, 'MethodDeclaration');
        this.variables = [];
        this.name = NameFactory_1.default.create(this, node.name);
        this.isConstructor = node.constructor;
        // currently we support only one constructor and no method overloading
        var type = parent;
        if (node.constructor) {
            var filtered = type.methods.filter(function (m) { return m.isConstructor; });
            if (filtered.length) {
                this.addError(Messages_1.default.Errors.ConstructorOverloadingNotSupported);
            }
        }
        else {
            var filtered = type.methods.filter(function (m) { return m.name.name === _this.name.name; });
            if (filtered.length) {
                this.addError(Messages_1.default.Errors.MethodOverloadingNotSupported);
            }
        }
        // function parameters created first so that block has access to their definition
        if (node.parameters.length) {
            this.parameters = new VariableDeclarationSingleVisitor_1.default(this, node.parameters);
        }
        if (node.returnType2) {
            this.returnType = TypeFactory_1.default.create(this, node.returnType2);
        }
        else {
            if (!node.constructor) {
                this.addError(Messages_1.default.Errors.MissingReturnType);
            }
        }
        if (node.body) {
            this.body = new BlockVisitor_1.default(this, node.body);
        }
        this.modifiers = new ModifiersVisitor_1.default(this, node.modifiers, ['abstract', 'static', 'private', 'public', 'protected'], ModifiersVisitor_1.ModifierLevel.Function);
        // type parameters
        if (node.typeParameters.length) {
            this.typeParameters = new TypeParameterVisitor_1.default(this, node.typeParameters);
        }
        // add this method to the list of methods of the parent
        if (this.parent.node.node === 'TypeDeclaration') {
            var owner = this.parent;
            owner.methods.push(this);
        }
        else {
            throw new Error('Unexpected parent of method declaration: ' + this.parent.node.node);
        }
    }
    MethodDeclarationVisitor.prototype.visit = function (builder) {
        // add modifiers
        if (this.modifiers) {
            this.modifiers.visit(builder);
        }
        // example: <X,Y> int[][] name(String n, int g[][], M<T> t) throws Ex {  }
        if (this.node.constructor) {
            builder.add('constructor');
        }
        else {
            this.name.visit(builder);
        }
        // type parameters
        if (this.typeParameters) {
            this.typeParameters.visit(builder);
        }
        console.log(this.node.node);
        // header
        builder.add('(');
        if (this.parameters) {
            this.parameters.visit(builder);
        }
        builder.add(')');
        if (this.returnType) {
            // type
            builder.add(': ');
            this.returnType.visit(builder);
        }
        builder.add(' ');
        // body
        if (this.body) {
            this.body.visit(builder);
        }
    };
    return MethodDeclarationVisitor;
}(VariableDeclarationFragmentVisitor_1.VariableHolderVisitor));
exports.MethodDeclarationVisitor = MethodDeclarationVisitor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MethodDeclarationVisitor;
