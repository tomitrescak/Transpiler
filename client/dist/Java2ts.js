"use strict";
var CompilationUnitVisitor_1 = require('./visitors/CompilationUnitVisitor');
var parser = require('../../imports/parser');
function parseTree(source) {
    return parser.parse(source);
}
exports.parseTree = parseTree;
function transpile(source) {
    var tree = parseTree(source);
    var cu = new CompilationUnitVisitor_1.default(null).visit(tree);
    return cu;
}
exports.transpile = transpile;
