"use strict";
var CompilationUnitVisitor_1 = require('./visitors/CompilationUnitVisitor');
var SourceMap_1 = require('./config/SourceMap');
var Handler_1 = require('./config/Handler');
var Builder_1 = require('./config/Builder');
var parser = require('../../imports/parser');
function parseTree(source) {
    return parser.parse(source);
}
exports.parseTree = parseTree;
function transpile(source, sourceMapIn, handlerIn) {
    Builder_1.default.sourceMap = sourceMapIn ? sourceMapIn : new SourceMap_1.default();
    Builder_1.default.handler = handlerIn ? handlerIn : new Handler_1.default();
    Builder_1.default.text = '';
    Builder_1.default.currentLine = 0;
    Builder_1.default.currentColumn = 0;
    Builder_1.default.lineText = '';
    // init source map, reset previous run
    Builder_1.default.sourceMap.init();
    var tree = parseTree(source);
    new CompilationUnitVisitor_1.default().visit(tree);
    console.log(Builder_1.default.sourceMap);
    return Builder_1.default.text;
}
exports.transpile = transpile;
