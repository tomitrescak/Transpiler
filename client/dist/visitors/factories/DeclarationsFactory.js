"use strict";
var FieldDeclarationVisitor_1 = require('../FieldDeclarationVisitor');
var FragmentsFactory = (function () {
    function FragmentsFactory() {
    }
    FragmentsFactory.create = function (parent, fragment, type) {
        switch (fragment.node) {
            case 'VariableDeclarationFragment':
                return new FieldDeclarationVisitor_1.FragmentVisitor(parent, fragment, type);
        }
    };
    FragmentsFactory.createArray = function (parent, fragments, type) {
        return fragments.map(function (f) { return FragmentsFactory.create(parent, f, type); });
    };
    return FragmentsFactory;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FragmentsFactory;
