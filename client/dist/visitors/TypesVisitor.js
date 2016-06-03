"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var NameVisitor_1 = require('./NameVisitor');
var PrimitiveTypeVisitor = (function (_super) {
    __extends(PrimitiveTypeVisitor, _super);
    function PrimitiveTypeVisitor() {
        _super.apply(this, arguments);
    }
    PrimitiveTypeVisitor.prototype.visit = function (type) {
        _super.prototype.check.call(this, type, 'PrimitiveType');
        if (PrimitiveTypeVisitor.numbers.indexOf(type.primitiveTypeCode) > -1) {
            return 'number';
        }
        else if (type.primitiveTypeCode === 'char') {
            return 'string';
        }
        return type.primitiveTypeCode;
    };
    PrimitiveTypeVisitor.numbers = ['byte', 'short', 'int', 'long', 'float', 'double'];
    return PrimitiveTypeVisitor;
}(Visitor_1.default));
exports.PrimitiveTypeVisitor = PrimitiveTypeVisitor;
var SimpleTypeVisitor = (function (_super) {
    __extends(SimpleTypeVisitor, _super);
    function SimpleTypeVisitor() {
        _super.apply(this, arguments);
    }
    SimpleTypeVisitor.prototype.visit = function (type) {
        _super.prototype.check.call(this, type, 'SimpleType');
        var name = new NameVisitor_1.default(this).visit(type.name);
        if (name === 'String') {
            return 'string';
        }
        return name;
    };
    return SimpleTypeVisitor;
}(Visitor_1.default));
exports.SimpleTypeVisitor = SimpleTypeVisitor;
var ParametrizedTypeVisitor = (function (_super) {
    __extends(ParametrizedTypeVisitor, _super);
    function ParametrizedTypeVisitor() {
        _super.apply(this, arguments);
    }
    ParametrizedTypeVisitor.prototype.visit = function (type) {
        _super.prototype.check.call(this, type, 'ParametrizedType');
        return '';
    };
    return ParametrizedTypeVisitor;
}(Visitor_1.default));
exports.ParametrizedTypeVisitor = ParametrizedTypeVisitor;
var ArrayTypeVisitor = (function (_super) {
    __extends(ArrayTypeVisitor, _super);
    function ArrayTypeVisitor() {
        _super.apply(this, arguments);
    }
    ArrayTypeVisitor.prototype.visit = function (type) {
        _super.prototype.check.call(this, type, 'ArrayType');
        return new TypeVisitor(this).visit(type.componentType) + '[]';
    };
    return ArrayTypeVisitor;
}(Visitor_1.default));
exports.ArrayTypeVisitor = ArrayTypeVisitor;
var TypesVisitor = (function (_super) {
    __extends(TypesVisitor, _super);
    function TypesVisitor() {
        _super.apply(this, arguments);
    }
    TypesVisitor.prototype.visit = function (types) {
        var _this = this;
        return types.map(function (type) { return new TypeVisitor(_this.parent).visit(type); }).join();
    };
    return TypesVisitor;
}(Visitor_1.default));
exports.TypesVisitor = TypesVisitor;
var TypeVisitor = (function (_super) {
    __extends(TypeVisitor, _super);
    function TypeVisitor() {
        _super.apply(this, arguments);
    }
    TypeVisitor.prototype.visit = function (type) {
        switch (type.node) {
            case 'PrimitiveType':
                return new PrimitiveTypeVisitor(this.parent).visit(type);
            case 'SimpleType':
                return new SimpleTypeVisitor(this.parent).visit(type);
            case 'ParametrizedType':
                return new ParametrizedTypeVisitor(this.parent).visit(type);
            case 'ArrayType':
                return new ArrayTypeVisitor(this.parent).visit(type);
            default:
                throw 'Unsupported node' + type.node;
        }
    };
    return TypeVisitor;
}(Visitor_1.default));
exports.TypeVisitor = TypeVisitor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypeVisitor;
