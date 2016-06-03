"use strict";
var Builder_1 = require('./config/Builder');
var parser = require('../../imports/parser');
function parseTree(source) {
    return parser.parse(source);
}
exports.parseTree = parseTree;
function transpile(source) {
    var tree = parseTree(source);
    var cu = Builder_1.default.build(tree);
    console.log(Builder_1.default.sourceMap);
    return cu;
}
exports.transpile = transpile;
