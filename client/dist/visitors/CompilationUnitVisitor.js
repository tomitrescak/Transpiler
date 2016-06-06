"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var TypeDeclarationVisitor_1 = require('./TypeDeclarationVisitor');
var CompilationUnitVisitor = (function (_super) {
    __extends(CompilationUnitVisitor, _super);
    function CompilationUnitVisitor() {
        _super.call(this, null);
    }
    CompilationUnitVisitor.prototype.visit = function (node) {
        // TODO: Handle imports
        // TODO: Handle packages
        TypeDeclarationVisitor_1.TypeDeclarationsVisitor.visit(this, node.types);
    };
    return CompilationUnitVisitor;
}(Visitor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CompilationUnitVisitor;
