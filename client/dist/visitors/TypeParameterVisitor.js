"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var NameFactory_1 = require('./factories/NameFactory');
var TypeFactory_1 = require('./factories/TypeFactory');
var TypeParameterVisitor = (function (_super) {
    __extends(TypeParameterVisitor, _super);
    function TypeParameterVisitor(parent, node) {
        var _this = this;
        _super.call(this, parent, node, 'TypeParameter');
        this.name = NameFactory_1.default.create(this, node.name).name;
        this.bounds = node.typeBounds.map(function (b) { return TypeFactory_1.default.create(_this, b); });
    }
    TypeParameterVisitor.prototype.visit = function (builder) {
        builder.add(this.name, this.location);
        if (this.bounds.length) {
            builder.add(' extends ');
            builder.join(this.bounds, ' & ');
        }
        return this;
    };
    return TypeParameterVisitor;
}(Visitor_1.default));
exports.TypeParameterVisitor = TypeParameterVisitor;
var TypeParametersVisitor = (function (_super) {
    __extends(TypeParametersVisitor, _super);
    function TypeParametersVisitor(parent, node) {
        var _this = this;
        _super.call(this, parent, node, 'TypeParameter');
        this.parameters = node.map(function (p) { return new TypeParameterVisitor(_this.parent, p); });
    }
    TypeParametersVisitor.prototype.visit = function (builder) {
        if (this.parameters.length) {
            builder.add('<');
            builder.join(this.parameters, ',');
            builder.add('>');
        }
        return this;
    };
    return TypeParametersVisitor;
}(Visitor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypeParametersVisitor;
