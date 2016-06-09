"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var BlockFactory_1 = require('./factories/BlockFactory');
var ExpressionFactory_1 = require('./factories/ExpressionFactory');
var IfStatementVisitor = (function (_super) {
    __extends(IfStatementVisitor, _super);
    function IfStatementVisitor(parent, node) {
        _super.call(this, parent, node, 'IfStatement');
    }
    IfStatementVisitor.prototype.visit = function (builder) {
        // TODO: check that type in the if stetement is boolean
        // condition
        builder.add('if (');
        ExpressionFactory_1.default.create(this, this.node.expression).visit(builder);
        builder.add(') ');
        // if statement
        if (this.node.thenStatement) {
            BlockFactory_1.default.create(this, this.node.thenStatement).visit(builder);
        }
        // else statement
        if (this.node.elseStatement) {
            builder.addLine();
            console.log(this.indent);
            builder.pad(this.indent);
            builder.add('else ');
            BlockFactory_1.default.create(this, this.node.elseStatement).visit(builder);
        }
    };
    return IfStatementVisitor;
}(Visitor_1.default));
exports.IfStatementVisitor = IfStatementVisitor;
