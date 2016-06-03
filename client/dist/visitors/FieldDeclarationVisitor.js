"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var ModifiersVisitor_1 = require('./ModifiersVisitor');
var TypesVisitor_1 = require('./TypesVisitor');
var NameVisitor_1 = require('./NameVisitor');
var InitializerVisitor_1 = require('./InitializerVisitor');
var FieldDeclarationVisitor = (function (_super) {
    __extends(FieldDeclarationVisitor, _super);
    function FieldDeclarationVisitor() {
        _super.apply(this, arguments);
    }
    FieldDeclarationVisitor.prototype.visit = function (node) {
        _super.prototype.check.call(this, node, 'FieldDeclaration');
        var modifiers = new ModifiersVisitor_1.default(this).visit(node.modifiers);
        var type = new TypesVisitor_1.default(this).visit(node.type);
        var fragments = new FragmentsVisitor(this).visit(node.fragments, type);
        return "" + this.pad() + modifiers + fragments + ";" + Visitor_1.default.newLine();
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
    FragmentVisitor.prototype.visit = function (fragment, type) {
        if (type === void 0) { type = ''; }
        var extraDimensions = '';
        if (fragment.extraDimensions) {
            // adds [] from variable a[][] to type
            for (var i = 0; i < fragment.extraDimensions; i++) {
                extraDimensions += '[]';
            }
        }
        var name = new NameVisitor_1.default(this).visit(fragment.name);
        // initialise types to default values
        var initialiser = '';
        if (fragment.initializer === null || fragment.initializer === undefined) {
            switch (type) {
                case 'number':
                    initialiser = '0';
                    break;
                default:
                    initialiser = 'null';
            }
        }
        else {
            initialiser = new InitializerVisitor_1.default(this).visit(fragment.initializer);
        }
        var finalType = type + extraDimensions;
        return name + ": " + finalType + " = " + initialiser;
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
        if (type === void 0) { type = ''; }
        return fragments.map(function (fragment) { return new FragmentVisitor(_this.parent).visit(fragment, type); }).join(', ');
    };
    return FragmentsVisitor;
}(Visitor_1.default));
