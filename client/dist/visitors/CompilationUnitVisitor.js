"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var TypeDeclarationsFactory_1 = require('./factories/TypeDeclarationsFactory');
var CompilationUnitNode = (function (_super) {
    __extends(CompilationUnitNode, _super);
    function CompilationUnitNode(node, handler) {
        _super.call(this, null, node, 'CompilationUnit');
        this.handler = handler;
        this.declarations = TypeDeclarationsFactory_1.default.createArray(this, node.types);
    }
    CompilationUnitNode.prototype.visit = function (builder) {
        builder.join(this.declarations, '\n');
    };
    CompilationUnitNode.prototype.findDeclaration = function (name) {
        return this.declarations.find(function (d) { return d.name.name === name; });
    };
    return CompilationUnitNode;
}(Visitor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CompilationUnitNode;
