"use strict";
var CompilationUnitVisitor_1 = require('./visitors/CompilationUnitVisitor');
var Builder_1 = require('./config/Builder');
var parser = require('../../imports/parser');
function parseTree(source) {
    return parser.parse(source);
}
exports.parseTree = parseTree;
function transpile(source, handlerIn) {
    var builder = new Builder_1.default(handlerIn);
    var tree = parseTree(source);
    var cu = new CompilationUnitVisitor_1.default(tree, builder.handler);
    cu.visit(builder);
    return builder;
}
exports.transpile = transpile;
