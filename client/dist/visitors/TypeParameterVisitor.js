"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var Builder_1 = require('../config/Builder');
var NameVisitor_1 = require('./NameVisitor');
var TypesVisitor_1 = require('./TypesVisitor');
var TypeParameterVisitor = (function (_super) {
    __extends(TypeParameterVisitor, _super);
    function TypeParameterVisitor() {
        _super.apply(this, arguments);
    }
    TypeParameterVisitor.prototype.visit = function (type) {
        var _this = this;
        _super.prototype.check.call(this, type, 'TypeParameter');
        // draw name
        NameVisitor_1.default.visit(this, type.name);
        if (type.typeBounds.length) {
            Builder_1.default.add(' extends ');
            Builder_1.default.join(type.typeBounds, function (b) { return TypesVisitor_1.default.visit(_this, b); }, ' & ');
        }
        return this;
    };
    return TypeParameterVisitor;
}(Visitor_1.default));
exports.TypeParameterVisitor = TypeParameterVisitor;
var TypeParametersVisitor = (function () {
    function TypeParametersVisitor() {
    }
    TypeParametersVisitor.visit = function (parent, types) {
        if (types.length) {
            Builder_1.default.add('<');
            Builder_1.default.join(types, function (type) { return new TypeParameterVisitor(parent).visit(type); }, ',');
            Builder_1.default.add('>');
        }
        return this;
    };
    return TypeParametersVisitor;
}());
exports.TypeParametersVisitor = TypeParametersVisitor;
