"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
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
        var bounds = '';
        if (type.typeBounds.length) {
            bounds = Visitor_1.default.join(type.typeBounds.map(function (b) { return new TypesVisitor_1.default(_this).visit(b); }), ' & ');
            bounds = ' extends ' + bounds;
        }
        return "" + new NameVisitor_1.default(this).visit(type.name) + bounds;
    };
    return TypeParameterVisitor;
}(Visitor_1.default));
exports.TypeParameterVisitor = TypeParameterVisitor;
var TypeParametersVisitor = (function (_super) {
    __extends(TypeParametersVisitor, _super);
    function TypeParametersVisitor() {
        _super.apply(this, arguments);
    }
    TypeParametersVisitor.prototype.visit = function (types) {
        var _this = this;
        if (!types.length) {
            return '';
        }
        return '<' + types.map(function (type) { return new TypeParameterVisitor(_this.parent).visit(type); }).join() + '>';
    };
    return TypeParametersVisitor;
}(Visitor_1.default));
exports.TypeParametersVisitor = TypeParametersVisitor;
