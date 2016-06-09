"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var Messages_1 = require('../config/Messages');
var TypeFactory_1 = require('./factories/TypeFactory');
var NameFactory_1 = require('./factories/NameFactory');
var ExpressionFactory_1 = require('./factories/ExpressionFactory');
var VariableDeclarationFragmentVisitor = (function (_super) {
    __extends(VariableDeclarationFragmentVisitor, _super);
    function VariableDeclarationFragmentVisitor(parent, node, typeDefinition, nodeName) {
        if (nodeName === void 0) { nodeName = 'VariableDeclarationFragment'; }
        _super.call(this, parent, node, nodeName);
        this.name = NameFactory_1.default.create(this, node.name);
        this.type = TypeFactory_1.default.create(this, typeDefinition);
        // prepare initialiser and check for possible type clashes
        if (node.initializer) {
            this.initialiser = ExpressionFactory_1.default.create(this, node.initializer);
        }
        // add this method to the list of methods of the parent
        var variableHolder = this.findParent(['TypeDeclaration', 'MethodDeclaration', 'Block']);
        console.log(variableHolder.node.node);
        console.log(variableHolder.variables);
        variableHolder.variables.push(this);
    }
    VariableDeclarationFragmentVisitor.prototype.validate = function () {
        if (!this.initialiser) {
            return;
        }
        var fieldType = this.type.originalName;
        var initializerType = this.initialiser.returnType;
        var fidx = VariableDeclarationFragmentVisitor.order.indexOf(fieldType);
        var iidx = VariableDeclarationFragmentVisitor.order.indexOf(initializerType);
        console.log('ITYPE: ' + initializerType);
        // check numbers
        if (fidx > -1 && iidx > -1) {
            if (fidx < iidx) {
                this.addError(Messages_1.default.Errors.TypeMismatch, initializerType, fieldType);
            }
        }
        // strings
        if (fieldType === 'String' && initializerType === 'char') {
            this.addError(Messages_1.default.Errors.TypeMismatch, initializerType, fieldType);
        }
        if (fieldType === 'char' && initializerType === 'String') {
            this.addError(Messages_1.default.Errors.TypeMismatch, initializerType, fieldType);
        }
    };
    VariableDeclarationFragmentVisitor.prototype.visit = function (builder, lineDeclaration) {
        if (lineDeclaration === void 0) { lineDeclaration = true; }
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
        // line declarations have extra stuff such as initialiser
        if (lineDeclaration) {
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
                    case 'boolean':
                        dinitialiser = 'false';
                        break;
                    default:
                        dinitialiser = 'null';
                }
                builder.add(dinitialiser);
            }
        }
        this.validate();
    };
    VariableDeclarationFragmentVisitor.order = ['byte', 'short', 'int', 'long', 'float', 'double'];
    VariableDeclarationFragmentVisitor.maxValue = [128, 32768, 2147483648, 9.223372037E18, 0, 0];
    return VariableDeclarationFragmentVisitor;
}(Visitor_1.default));
exports.VariableDeclarationFragmentVisitor = VariableDeclarationFragmentVisitor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VariableDeclarationFragmentVisitor;
