"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Messages_1 = require('../config/Messages');
var Visitor_1 = require('./Visitor');
var NameFactory_1 = require('./factories/NameFactory');
var TypeFactory_1 = require('./factories/TypeFactory');
var PrimitiveTypeVisitor = (function (_super) {
    __extends(PrimitiveTypeVisitor, _super);
    function PrimitiveTypeVisitor(parent, node) {
        _super.call(this, parent, node, 'PrimitiveType');
        this.originalName = node.primitiveTypeCode;
        if (PrimitiveTypeVisitor.numbers.indexOf(node.primitiveTypeCode) > -1) {
            this.name = 'number';
        }
        else if (node.primitiveTypeCode === 'char') {
            this.name = 'string';
        }
        else {
            this.name = node.primitiveTypeCode;
        }
    }
    PrimitiveTypeVisitor.prototype.visit = function (builder) {
        builder.add(this.name, this.node.location);
    };
    PrimitiveTypeVisitor.numbers = ['byte', 'short', 'int', 'long', 'float', 'double'];
    return PrimitiveTypeVisitor;
}(Visitor_1.default));
exports.PrimitiveTypeVisitor = PrimitiveTypeVisitor;
var SimpleTypeVisitor = (function (_super) {
    __extends(SimpleTypeVisitor, _super);
    function SimpleTypeVisitor(parent, node) {
        _super.call(this, parent, node, 'SimpleType');
        this.nameNode = NameFactory_1.default.create(this, node.name);
        this.originalName = this.nameNode.name;
        this.name = this.nameNode.name;
        if (this.name === 'string') {
            this.addError(Messages_1.default.Errors.SymbolNotFound, 'string');
        }
    }
    SimpleTypeVisitor.prototype.visit = function (builder) {
        this.nameNode.visit(builder, ['String', 'string']);
    };
    return SimpleTypeVisitor;
}(Visitor_1.default));
exports.SimpleTypeVisitor = SimpleTypeVisitor;
var ParametrizedTypeVisitor = (function (_super) {
    __extends(ParametrizedTypeVisitor, _super);
    function ParametrizedTypeVisitor(parent, node) {
        _super.call(this, parent, node, 'ParameterizedType');
        this.type = TypeFactory_1.default.create(this, node.type);
        this.typeArguments = TypeFactory_1.default.createArray(this, node.typeArguments);
        this.originalName = this.type.originalName;
        this.name = this.type.name;
    }
    ParametrizedTypeVisitor.prototype.visit = function (builder) {
        this.type.visit(builder);
        builder.add('<');
        builder.join(this.typeArguments, ',');
        builder.add('>');
    };
    return ParametrizedTypeVisitor;
}(Visitor_1.default));
exports.ParametrizedTypeVisitor = ParametrizedTypeVisitor;
var ArrayTypeVisitor = (function (_super) {
    __extends(ArrayTypeVisitor, _super);
    function ArrayTypeVisitor(parent, node) {
        _super.call(this, parent, node, 'ArrayType');
        this.nameNode = TypeFactory_1.default.create(this, node.componentType);
        this.name = this.nameNode.name;
        this.originalName = this.name;
        this.name += '[]'; // add it to the local name
    }
    ArrayTypeVisitor.prototype.visit = function (builder) {
        this.nameNode.visit(builder);
        builder.add('[]');
    };
    return ArrayTypeVisitor;
}(Visitor_1.default));
exports.ArrayTypeVisitor = ArrayTypeVisitor;
var UnionTypeVisitor = (function (_super) {
    __extends(UnionTypeVisitor, _super);
    function UnionTypeVisitor(parent, node) {
        _super.call(this, parent, node, 'UnionType');
        this.types = TypeFactory_1.default.createArray(this, node.types);
        this.name = this.types.map(function (t) { return t.originalName; }).join('|');
        this.originalName = this.name;
    }
    UnionTypeVisitor.prototype.visit = function (builder) {
        builder.join(this.types, '|');
    };
    return UnionTypeVisitor;
}(Visitor_1.default));
exports.UnionTypeVisitor = UnionTypeVisitor;
var TypesVisitor = (function () {
    function TypesVisitor() {
    }
    TypesVisitor.visit = function (parent, types) {
        return types.map(function (type) { return TypeFactory_1.default.create(parent, type); });
    };
    return TypesVisitor;
}());
exports.TypesVisitor = TypesVisitor;
