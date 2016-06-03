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
        var nameVisitor = new NameVisitor_1.default(this).visit(type.name, ['String', 'string']);
        this.name = nameVisitor.name;
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
        this.name = new TypeVisitor(this).visit(type.componentType).name;
        this.name += '[]'; // add it to the local name
        Builder_1.default.add('[]'); // add it to the builder
    };
    return ArrayTypeVisitor;
}(BaseTypeVisitor));
exports.ArrayTypeVisitor = ArrayTypeVisitor;
var TypesVisitor = (function (_super) {
    __extends(TypesVisitor, _super);
    function TypesVisitor() {
        _super.apply(this, arguments);
    }
    TypesVisitor.prototype.visit = function (types) {
        var _this = this;
        types.forEach(function (type) { return new TypeVisitor(_this.parent).visit(type); });
    };
    return TypesVisitor;
}(Visitor_1.default));
exports.TypesVisitor = TypesVisitor;
var TypeVisitor = (function (_super) {
    __extends(TypeVisitor, _super);
    function TypeVisitor() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TypeVisitor.prototype, "name", {
        get: function () {
            return this.typeNode.name;
        },
        enumerable: true,
        configurable: true
    });
    TypeVisitor.prototype.visit = function (type) {
        switch (type.node) {
            case 'PrimitiveType':
                this.typeNode = new PrimitiveTypeVisitor(this.parent);
                this.typeNode.visit(type);
                break;
            case 'SimpleType':
                this.typeNode = new SimpleTypeVisitor(this.parent);
                this.typeNode.visit(type);
                break;
            case 'ParametrizedType':
                this.typeNode = new ParametrizedTypeVisitor(this.parent);
                this.typeNode.visit(type);
                break;
            case 'ArrayType':
                this.typeNode = new ArrayTypeVisitor(this.parent);
                this.typeNode.visit(type);
                break;
            default:
                throw 'Unsupported node' + type.node;
        }
        return this;
    };
    return TypeVisitor;
}(Visitor_1.default));
exports.TypeVisitor = TypeVisitor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypeVisitor;
