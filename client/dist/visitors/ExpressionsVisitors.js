"use strict";
var NumberLiteralVisitor = (function () {
    function NumberLiteralVisitor() {
    }
    NumberLiteralVisitor.visit = function (node) {
        return node.token;
    };
    return NumberLiteralVisitor;
}());
exports.NumberLiteralVisitor = NumberLiteralVisitor;
