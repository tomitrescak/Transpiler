"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var Builder_1 = require('../config/Builder');
var NameVisitor_1 = require('./NameVisitor');
var BaseTypeVisitor = (function (_super) {
    __extends(BaseTypeVisitor, _super);
    function BaseTypeVisitor() {
        _super.apply(this, arguments);
    }
    return BaseTypeVisitor;
}(Visitor_1.default));
var PrimitiveTypeVisitor = (function (_super) {
    __extends(PrimitiveTypeVisitor, _super);
    function PrimitiveTypeVisitor() {
        _super.apply(this, arguments);
    }
    PrimitiveTypeVisitor.prototype.visit = function (type) {
        _super.prototype.check.call(this, type, 'PrimitiveType');
        if (PrimitiveTypeVisitor.numbers.indexOf(type.primitiveTypeCode) > -1) {
            this.name = 'number';
        }
        else if (type.primitiveTypeCode === 'char') {
            this.name = 'string';
        }
        else {
            this.name = type.primitiveTypeCode;
        }
        Builder_1.default.add(this.name, type);
        return this;
    };
    PrimitiveTypeVisitor.numbers = ['byte', 'short', 'int', 'long', 'float', 'double'];
    return PrimitiveTypeVisitor;
}(BaseTypeVisitor));
exports.PrimitiveTypeVisitor = PrimitiveTypeVisitor;
var SimpleTypeVisitor = (function (_super) {
    __extends(SimpleTypeVisitor, _super);
    function SimpleTypeVisitor() {
        _super.apply(this, arguments);
    }
    SimpleTypeVisitor.prototype.visit = function (type) {
        _super.prototype.check.call(this, type, 'SimpleType');
        var nameVisitor = NameVisitor_1.default.visit(this, type.name, ['String', 'string']);
        this.name = nameVisitor.name;
        return this;
    };
    return SimpleTypeVisitor;
}(BaseTypeVisitor));
exports.SimpleTypeVisitor = SimpleTypeVisitor;
var ParametrizedTypeVisitor = (function (_super) {
    __extends(ParametrizedTypeVisitor, _super);
    function ParametrizedTypeVisitor() {
        _super.apply(this, arguments);
    }
    ParametrizedTypeVisitor.prototype.visit = function (type) {
        _super.prototype.check.call(this, type, 'ParametrizedType');
        return this;
    };
    return ParametrizedTypeVisitor;
}(BaseTypeVisitor));
exports.ParametrizedTypeVisitor = ParametrizedTypeVisitor;
var ArrayTypeVisitor = (function (_super) {
    __extends(ArrayTypeVisitor, _super);
    function ArrayTypeVisitor() {
        _super.apply(this, arguments);
    }
    ArrayTypeVisitor.prototype.visit = function (type) {
        _super.prototype.check.call(this, type, 'ArrayType');
        this.name = TypeVisitor.visit(this, type.componentType).name;
        this.name += '[]'; // add it to the local name
        Builder_1.default.add('[]'); // add it to the builder
        return this;
    };
    return ArrayTypeVisitor;
}(BaseTypeVisitor));
exports.ArrayTypeVisitor = ArrayTypeVisitor;
var TypesVisitor = (function () {
    function TypesVisitor() {
    }
    TypesVisitor.visit = function (parent, types) {
        types.forEach(function (type) { return TypeVisitor.visit(parent, type); });
    };
    return TypesVisitor;
}());
exports.TypesVisitor = TypesVisitor;
var TypeVisitor = (function () {
    function TypeVisitor() {
    }
    TypeVisitor.visit = function (parent, type) {
        // console.log(type)
        switch (type.node) {
            case 'PrimitiveType':
                return new PrimitiveTypeVisitor(parent).visit(type);
            case 'SimpleType':
                return new SimpleTypeVisitor(parent).visit(type);
            case 'ParametrizedType':
                return new ParametrizedTypeVisitor(parent).visit(type);
            case 'ArrayType':
                return new ArrayTypeVisitor(parent).visit(type);
            default:
                throw 'Unsupported node' + type.node;
        }
    };
    return TypeVisitor;
}());
exports.TypeVisitor = TypeVisitor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypeVisitor;
