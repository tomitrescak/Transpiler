"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var Builder_1 = require('../config/Builder');
var MarkerVisitor = (function (_super) {
    __extends(MarkerVisitor, _super);
    function MarkerVisitor() {
        _super.apply(this, arguments);
    }
    MarkerVisitor.prototype.visit = function (node, allowAnnotations) {
        if (allowAnnotations === void 0) { allowAnnotations = true; }
        _super.prototype.check.call(this, node, 'MarkerAnnotation');
        if (!allowAnnotations) {
            Builder_1.default.addWarning(Builder_1.default.Warnigns.IgnoredAnnotation(), node.location);
            return '';
        }
        throw new Error('Not implemented');
    };
    return MarkerVisitor;
}(Visitor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MarkerVisitor;
