"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var MarkerVisitor = (function (_super) {
    __extends(MarkerVisitor, _super);
    function MarkerVisitor(parent, node, allowAnnotations) {
        if (allowAnnotations === void 0) { allowAnnotations = true; }
        _super.call(this, parent, node, 'MarkerAnnotation');
        this.allowAnnotations = allowAnnotations;
    }
    MarkerVisitor.prototype.visit = function (builder) {
        if (!this.allowAnnotations) {
            this.addWarning(builder.Warnigns.IgnoredAnnotation);
            return '';
        }
        throw new Error('Not implemented');
    };
    return MarkerVisitor;
}(Visitor_1.default));
exports.MarkerVisitor = MarkerVisitor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MarkerVisitor;
