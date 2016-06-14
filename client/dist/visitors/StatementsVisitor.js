"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var BlockFactory_1 = require('./factories/BlockFactory');
var ExpressionFactory_1 = require('./factories/ExpressionFactory');
var Messages_1 = require('../config/Messages');
var VariableDeclarationSingleVisitor_1 = require('./VariableDeclarationSingleVisitor');
var IfStatementVisitor = (function (_super) {
    __extends(IfStatementVisitor, _super);
    function IfStatementVisitor(parent, node) {
        _super.call(this, parent, node, 'IfStatement');
    }
    IfStatementVisitor.prototype.visit = function (builder) {
        var expression = ExpressionFactory_1.default.create(this, this.node.expression);
        // condition
        builder.add('if (');
        expression.visit(builder);
        builder.add(') ');
        if (expression.returnType !== 'boolean') {
            this.addError(Messages_1.default.Errors.ConditionTypeMismatch, expression.returnType, 'boolean');
        }
        // if statement
        if (this.node.thenStatement) {
            BlockFactory_1.default.create(this, this.node.thenStatement).visit(builder);
        }
        // else statement
        if (this.node.elseStatement) {
            builder.addLine();
            builder.pad(this.indent);
            builder.add('else ');
            BlockFactory_1.default.create(this, this.node.elseStatement).visit(builder);
        }
    };
    return IfStatementVisitor;
}(Visitor_1.default));
exports.IfStatementVisitor = IfStatementVisitor;
var WhileStatementVisitor = (function (_super) {
    __extends(WhileStatementVisitor, _super);
    function WhileStatementVisitor(parent, node) {
        _super.call(this, parent, node, 'WhileStatement');
    }
    WhileStatementVisitor.prototype.visit = function (builder) {
        var expression = ExpressionFactory_1.default.create(this, this.node.expression);
        // condition
        builder.add('while (');
        expression.visit(builder);
        builder.add(') ');
        if (expression.returnType !== 'boolean') {
            this.addError(Messages_1.default.Errors.ConditionTypeMismatch, expression.returnType, 'boolean');
        }
        // body is either block or a single expression
        if (this.node.body) {
            BlockFactory_1.default.create(this, this.node.body).visit(builder);
        }
    };
    return WhileStatementVisitor;
}(Visitor_1.default));
exports.WhileStatementVisitor = WhileStatementVisitor;
var SwitchStatementVisitor = (function (_super) {
    __extends(SwitchStatementVisitor, _super);
    function SwitchStatementVisitor(parent, node) {
        _super.call(this, parent, node, 'SwitchStatement');
    }
    SwitchStatementVisitor.prototype.visit = function (builder) {
        var expression = ExpressionFactory_1.default.create(this, this.node.expression);
        // condition
        builder.add('switch (');
        expression.visit(builder);
        builder.add(') {\n');
        this.incIndent();
        builder.pad(this.indent);
        // body is either block or a single expression
        var statements = BlockFactory_1.default.createArray(this, this.node.statements);
        builder.join(statements, '\n' + this.pad());
        builder.addLine();
        builder.pad(this.parent.indent);
        builder.add('}');
    };
    return SwitchStatementVisitor;
}(Visitor_1.default));
exports.SwitchStatementVisitor = SwitchStatementVisitor;
var SwitchCaseVisitor = (function (_super) {
    __extends(SwitchCaseVisitor, _super);
    function SwitchCaseVisitor(parent, node) {
        _super.call(this, parent, node, 'SwitchCase');
    }
    SwitchCaseVisitor.prototype.visit = function (builder) {
        // condition
        // it's either a case node or default node
        if (this.node.expression) {
            builder.add('case ');
            console.log(this.node);
            var expression = ExpressionFactory_1.default.create(this, this.node.expression);
            expression.visit(builder);
        }
        else {
            builder.add('default');
        }
        builder.add(':');
    };
    return SwitchCaseVisitor;
}(Visitor_1.default));
exports.SwitchCaseVisitor = SwitchCaseVisitor;
var BreakStatementVisitor = (function (_super) {
    __extends(BreakStatementVisitor, _super);
    function BreakStatementVisitor(parent, node) {
        _super.call(this, parent, node, 'BreakStatement');
        if (this.node.label) {
            this.addError(Messages_1.default.Errors.LabelsNotSupported);
        }
    }
    BreakStatementVisitor.prototype.visit = function (builder) {
        // condition
        builder.add('break;');
    };
    return BreakStatementVisitor;
}(Visitor_1.default));
exports.BreakStatementVisitor = BreakStatementVisitor;
var ContinueStatementVisitor = (function (_super) {
    __extends(ContinueStatementVisitor, _super);
    function ContinueStatementVisitor(parent, node) {
        _super.call(this, parent, node, 'ContinueStatement');
        if (this.node.label) {
            this.addError(Messages_1.default.Errors.LabelsNotSupported);
        }
    }
    ContinueStatementVisitor.prototype.visit = function (builder) {
        // condition
        builder.add('continue;');
    };
    return ContinueStatementVisitor;
}(Visitor_1.default));
exports.ContinueStatementVisitor = ContinueStatementVisitor;
var ReturnStatementVisitor = (function (_super) {
    __extends(ReturnStatementVisitor, _super);
    function ReturnStatementVisitor(parent, node) {
        _super.call(this, parent, node, 'ReturnStatement');
    }
    ReturnStatementVisitor.prototype.visit = function (builder) {
        // condition
        builder.add('return ');
        var expression = ExpressionFactory_1.default.create(this, this.node.expression);
        expression.visit(builder);
        builder.add(';');
    };
    return ReturnStatementVisitor;
}(Visitor_1.default));
exports.ReturnStatementVisitor = ReturnStatementVisitor;
var TryStatementVisitor = (function (_super) {
    __extends(TryStatementVisitor, _super);
    function TryStatementVisitor(parent, node) {
        _super.call(this, parent, node, 'TryStatement');
        // validate that there can be only one catch clauses
        if (node.catchClauses.length > 1) {
            this.addError(Messages_1.default.Errors.MoreCatchClausesNotSupported);
        }
        // try resources are not supported
        if (node.resources.length) {
            this.addError(Messages_1.default.Errors.TryResourcesNotSupported);
        }
    }
    TryStatementVisitor.prototype.visit = function (builder) {
        // condition
        builder.add('try ');
        // body of the try statement
        var body = BlockFactory_1.default.create(this, this.node.body);
        body.visit(builder);
        // add new line and padding
        builder.addLine();
        if (this.node.catchClauses.length) {
            builder.pad(this.indent);
        }
        // catch clauses
        var catchClauses = BlockFactory_1.default.createArray(this, this.node.catchClauses);
        builder.join(catchClauses, '\n' + this.pad());
        // finally
        if (this.node.finally) {
            var final = BlockFactory_1.default.create(this, this.node.finally);
            builder.addLine();
            builder.pad(this.indent);
            builder.add('finally ');
            final.visit(builder);
        }
    };
    return TryStatementVisitor;
}(Visitor_1.default));
exports.TryStatementVisitor = TryStatementVisitor;
var CatchClauseVisitor = (function (_super) {
    __extends(CatchClauseVisitor, _super);
    function CatchClauseVisitor(parent, node) {
        _super.call(this, parent, node, 'CatchClause');
    }
    CatchClauseVisitor.prototype.visit = function (builder) {
        var exception = new VariableDeclarationSingleVisitor_1.SingleVariableDeclarationVisitor(this, this.node.exception);
        var body = BlockFactory_1.default.create(this, this.node.body);
        // try resources are not supported
        builder.add('catch (');
        exception.name.visit(builder);
        builder.add(') ');
        body.visit(builder);
    };
    return CatchClauseVisitor;
}(Visitor_1.default));
exports.CatchClauseVisitor = CatchClauseVisitor;
