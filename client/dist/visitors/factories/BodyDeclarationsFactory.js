"use strict";
var FieldDeclarationVisitor_1 = require('../FieldDeclarationVisitor');
var BodyDeclarationsFactory = (function () {
    function BodyDeclarationsFactory() {
    }
    BodyDeclarationsFactory.create = function (parent, type) {
        switch (type.node) {
            case 'FieldDeclaration':
                return new FieldDeclarationVisitor_1.FieldDeclarationVisitor(parent, type);
            default:
                throw type.node + ' is not implemented';
        }
    };
    BodyDeclarationsFactory.createArray = function (parent, types) {
        return types.map(function (t) { return BodyDeclarationsFactory.create(parent, t); });
    };
    return BodyDeclarationsFactory;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BodyDeclarationsFactory;
