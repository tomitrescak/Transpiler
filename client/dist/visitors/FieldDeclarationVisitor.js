"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var Builder_1 = require('../config/Builder');
var ModifiersVisitor_1 = require('./ModifiersVisitor');
var TypesVisitor_1 = require('./TypesVisitor');
var NameVisitor_1 = require('./NameVisitor');
var ExpressionsVisitors_1 = require('./ExpressionsVisitors');
var FieldDeclarationVisitor = (function (_super) {
    __extends(FieldDeclarationVisitor, _super);
    function FieldDeclarationVisitor() {
        _super.apply(this, arguments);
    }
    FieldDeclarationVisitor.prototype.visit = function (node) {
        _super.prototype.check.call(this, node, 'FieldDeclaration');
        Builder_1.default.pad(this.indent);
        ModifiersVisitor_1.default.visit(this, node.modifiers);
        new FragmentsVisitor(this).visit(node.fragments, node.type);
        Builder_1.default.add(';\n');
    };
    return FieldDeclarationVisitor;
}(Visitor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FieldDeclarationVisitor;
// export default class FieldDeclarationsVisitor extends Visitor {
//   visit(types: FieldDeclaration[]): string {
//     return types.map((type) => new FieldDeclarationVisitor(this.parent).visit(type)).join();
//   }
// }
// fragments
var FragmentVisitor = (function (_super) {
    __extends(FragmentVisitor, _super);
    function FragmentVisitor() {
        _super.apply(this, arguments);
    }
    FragmentVisitor.prototype.visit = function (fragment, typeDefinition) {
        var extraDimensions = '';
        if (fragment.extraDimensions) {
            // adds [] from variable a[][] to type
            for (var i = 0; i < fragment.extraDimensions; i++) {
                extraDimensions += '[]';
            }
        }
        // prefix name : type = initialiser;
        NameVisitor_1.default.visit(this, fragment.name);
        // add :
        Builder_1.default.add(': ');
        // add type
        var type = TypesVisitor_1.default.visit(this, typeDefinition).name;
        // add extra dimension
        Builder_1.default.add(extraDimensions);
        // add iniitliser
        Builder_1.default.add(' = ');
        // initialise types to default values
        if (fragment.initializer === null || fragment.initializer === undefined) {
            var initialiser = '';
            switch (type) {
                case 'number':
                    initialiser = '0';
                    break;
                default:
                    initialiser = 'null';
            }
            Builder_1.default.add(initialiser);
        }
        else {
            ExpressionsVisitors_1.default.visit(this, fragment.initializer);
        }
    };
    return FragmentVisitor;
}(Visitor_1.default));
var FragmentsVisitor = (function (_super) {
    __extends(FragmentsVisitor, _super);
    function FragmentsVisitor() {
        _super.apply(this, arguments);
    }
    FragmentsVisitor.prototype.visit = function (fragments, type) {
        var _this = this;
        Builder_1.default.join(fragments, function (fragment) {
            return new FragmentVisitor(_this.parent).visit(fragment, type);
        }, ', ');
    };
    return FragmentsVisitor;
}(Visitor_1.default));
