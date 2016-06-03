"use strict";
var CompilationUnitVisitor_1 = require('./visitors/CompilationUnitVisitor');
var Visitor_1 = require('./visitors/Visitor');
var parser = require('../../imports/parser');
function parseTree(source) {
    return parser.parse(source);
}
exports.parseTree = parseTree;
function transpile(source) {
    var tree = parseTree(source);
    var cu = new CompilationUnitVisitor_1.default(null).visit(tree);
    console.log(Visitor_1.default.sourceMap);
    return cu;
}
exports.transpile = transpile;
