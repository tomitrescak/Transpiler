"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var ModifiersFactory_1 = require('./factories/ModifiersFactory');
var TypeFactory_1 = require('./factories/TypeFactory');
var NameFactory_1 = require('./factories/NameFactory');
var ExpressionFactory_1 = require('./factories/ExpressionFactory');
var DeclarationsFactory_1 = require('./factories/DeclarationsFactory');
var FieldDeclarationVisitor = (function (_super) {
    __extends(FieldDeclarationVisitor, _super);
    function FieldDeclarationVisitor(parent, node) {
        _super.call(this, parent, node, 'FieldDeclaration');
    }
    FieldDeclarationVisitor.prototype.visit = function (builder) {
        var modifiers = ModifiersFactory_1.default.create(this, this.node.modifiers);
        var fragments = DeclarationsFactory_1.default.createArray(this, this.node.fragments, this.node.type);
        builder.pad(this.indent);
        builder.join(modifiers, '');
        builder.join(fragments, ', ');
        builder.add(';\n');
    };
    return FieldDeclarationVisitor;
}(Visitor_1.default));
exports.FieldDeclarationVisitor = FieldDeclarationVisitor;
// export default class FieldDeclarationsVisitor extends Visitor {
//   visit(types: FieldDeclaration[]): string {
//     return types.map((type) => new FieldDeclarationVisitor(this.parent).visit(type)).join();
//   }
// }
// fragments
var FragmentVisitor = (function (_super) {
    __extends(FragmentVisitor, _super);
    function FragmentVisitor(parent, node, typeDefinition) {
        _super.call(this, parent, node, 'VariableDeclarationFragment');
        this.name = NameFactory_1.default.create(this, node.name);
        this.type = TypeFactory_1.default.create(this, typeDefinition);
        if (node.initializer) {
            this.initialiser = ExpressionFactory_1.default.create(this, node.initializer);
        }
    }
    FragmentVisitor.prototype.visit = function (builder) {
        var fragment = this.node;
        var extraDimensions = '';
        if (fragment.extraDimensions) {
            // adds [] from variable a[][] to type
            for (var i = 0; i < fragment.extraDimensions; i++) {
                extraDimensions += '[]';
            }
        }
        // prefix name : type = initialiser;
        this.name.visit(builder);
        // add :
        builder.add(': ');
        // add type
        this.type.visit(builder);
        // add extra dimension
        builder.add(extraDimensions);
        // add iniitliser
        builder.add(' = ');
        if (this.initialiser) {
            this.initialiser.visit(builder);
        }
        else {
            // initialise types to default values
            var dinitialiser = '';
            switch (this.type.name) {
                case 'number':
                    dinitialiser = '0';
                    break;
                default:
                    dinitialiser = 'null';
            }
            builder.add(dinitialiser);
        }
    };
    return FragmentVisitor;
}(Visitor_1.default));
exports.FragmentVisitor = FragmentVisitor;
