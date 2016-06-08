"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var MethodDeclarationVisitor = (function (_super) {
    __extends(MethodDeclarationVisitor, _super);
    function MethodDeclarationVisitor(parent, node) {
        _super.call(this, parent, node, 'MethodDeclaration');
    }
    MethodDeclarationVisitor.prototype.visit = function (builder) {
    };
    return MethodDeclarationVisitor;
}(Visitor_1.default));
exports.MethodDeclarationVisitor = MethodDeclarationVisitor;
