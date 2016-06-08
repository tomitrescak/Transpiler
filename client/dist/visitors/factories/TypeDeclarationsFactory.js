"use strict";
var TypeDeclarationVisitor_1 = require('../TypeDeclarationVisitor');
var EnumDeclarationVisitor_1 = require('../EnumDeclarationVisitor');
var TypeDeclarationsFactory = (function () {
    function TypeDeclarationsFactory() {
    }
    TypeDeclarationsFactory.create = function (parent, type) {
        switch (type.node) {
            case 'TypeDeclaration':
                return new TypeDeclarationVisitor_1.TypeDeclarationVisitor(parent, type);
            case 'EnumDeclaration':
                return new EnumDeclarationVisitor_1.EnumDeclarationVisitor(parent, type);
            default:
                throw new Error(type.node + ' is not implemented');
        }
    };
    TypeDeclarationsFactory.createArray = function (parent, types) {
        return types.map(function (t) { return TypeDeclarationsFactory.create(parent, t); });
    };
    return TypeDeclarationsFactory;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypeDeclarationsFactory;
