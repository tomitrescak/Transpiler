"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var MarkerVisitor = (function (_super) {
    __extends(MarkerVisitor, _super);
    function MarkerVisitor() {
        _super.apply(this, arguments);
    }
    MarkerVisitor.prototype.visit = function (node, allowAnnotations) {
        if (allowAnnotations === void 0) { allowAnnotations = true; }
        Visitor_1.default.checkNode(node, 'MarkerAnnotation');
        if (!allowAnnotations) {
            Visitor_1.default.addWarning(Visitor_1.default.messages.Warnings.IgnoredAnnotation(), node.line);
            return '';
        }
        throw new Error('Not implemented');
    };
    return MarkerVisitor;
}(Visitor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MarkerVisitor;
