"use strict";
var TypesVisitor_1 = require('../TypesVisitor');
var TypeFactory = (function () {
    function TypeFactory() {
    }
    TypeFactory.create = function (parent, type) {
        switch (type.node) {
            case 'PrimitiveType':
                return new TypesVisitor_1.PrimitiveTypeVisitor(parent, type);
            case 'SimpleType':
                return new TypesVisitor_1.SimpleTypeVisitor(parent, type);
            case 'ParameterizedType':
                return new TypesVisitor_1.ParametrizedTypeVisitor(parent, type);
            case 'ArrayType':
                return new TypesVisitor_1.ArrayTypeVisitor(parent, type);
            default:
                throw new Error('Unsupported node ' + type.node);
        }
    };
    TypeFactory.createArray = function (parent, types) {
        return types.map(function (t) { return TypeFactory.create(parent, t); });
    };
    return TypeFactory;
}());
exports.TypeFactory = TypeFactory;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypeFactory;
