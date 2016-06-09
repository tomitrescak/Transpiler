"use strict";
var VariableDeclarationFragmentVisitor_1 = require('../VariableDeclarationFragmentVisitor');
var FragmentsFactory = (function () {
    function FragmentsFactory() {
    }
    FragmentsFactory.create = function (parent, fragment, type, isStatic, isFinal) {
        switch (fragment.node) {
            case 'VariableDeclarationFragment':
                return new VariableDeclarationFragmentVisitor_1.VariableDeclarationFragmentVisitor(parent, fragment, type, isStatic, isFinal);
        }
    };
    FragmentsFactory.createArray = function (parent, fragments, type, isStatic, isFinal) {
        return fragments.map(function (f) { return FragmentsFactory.create(parent, f, type, isStatic, isFinal); });
    };
    return FragmentsFactory;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FragmentsFactory;
