"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var SourceMap_1 = require('../config/SourceMap');
var Handler_1 = require('../config/Handler');
var TypeDeclarationVisitor_1 = require('./TypeDeclarationVisitor');
var CompilationUnitVisitor = (function (_super) {
    __extends(CompilationUnitVisitor, _super);
    function CompilationUnitVisitor() {
        _super.apply(this, arguments);
    }
    CompilationUnitVisitor.prototype.visit = function (node, sourceMapIn, handlerIn) {
        Visitor_1.default.sourceMap = sourceMapIn ? sourceMapIn : new SourceMap_1.default();
        Visitor_1.default.handler = handlerIn ? handlerIn : new Handler_1.default();
        // init source map, reset previous run
        Visitor_1.default.sourceMap.init();
        // TODO: Handle imports
        // TODO: Handle packages
        return new TypeDeclarationVisitor_1.TypeDeclarationsVisitor(this).visit(node.types);
    };
    return CompilationUnitVisitor;
}(Visitor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CompilationUnitVisitor;
