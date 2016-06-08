"use strict";
var NameVisitor_1 = require('../NameVisitor');
var NameFactory = (function () {
    function NameFactory() {
    }
    NameFactory.create = function (parent, node, substitutions) {
        if (substitutions === void 0) { substitutions = null; }
        if (node.node === 'SimpleName') {
            return new NameVisitor_1.SimpleNameVisitor(parent, node, substitutions);
        }
        else if (node.node === 'QualifiedName') {
            return new NameVisitor_1.QualifiedNameVisitor(parent, node);
        }
        else {
            throw new Error('Unsupported node: ' + node.node);
        }
    };
    return NameFactory;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NameFactory;
