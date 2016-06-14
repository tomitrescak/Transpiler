import Visitor from './Visitor';
import BlockFactory from './factories/BlockFactory';
import ExpressionFactory from './factories/ExpressionFactory';
import BlockVisitor from './BlockVisitor';
import Messages from '../config/Messages';

declare global {
  interface IfStatement extends AstElement {
    node: 'IfStatement';
    elseStatement: Block;
    thenStatement: Block;
    expression: Expression;
  }

  interface WhileStatement extends AstElement {
    node: 'WhileStatement';
    body: Block;
    expression: Expression;
  }

  interface SwitchStatement extends AstElement {
    node: 'SwitchStatement';
    expression: Expression;
    statements: BlockElement[];
  }

  interface SwitchCase extends AstElement {
    node: 'SwitchCase';
    expression: Expression;
  }

  interface BreakStatement extends AstElement {
    node: 'BreakStatement';
    label: Names;
  }

  interface ContinueStatement extends AstElement {
    node: 'ContinueStatement';
    label: Names;
  }

  interface ReturnStatement extends AstElement {
    expression: Expression;
  }
}

export class IfStatementVisitor extends Visitor<IfStatement> {
  constructor(parent: IVisitor, node: IfStatement) {
    super(parent, node, 'IfStatement');
  }

  visit (builder: IBuilder) {
    const expression = ExpressionFactory.create(this, this.node.expression);

    // condition
    builder.add('if (');
    expression.visit(builder);
    builder.add(') ');

    if (expression.returnType !== 'boolean') {
      this.addError(Messages.Errors.ConditionTypeMismatch, expression.returnType, 'boolean')
    }

    // if statement
    if (this.node.thenStatement) {
      BlockFactory.create(this, this.node.thenStatement).visit(builder);
    }

    // else statement
    if (this.node.elseStatement) {
      builder.addLine();
      builder.pad(this.indent);
      builder.add('else ');
      BlockFactory.create(this, this.node.elseStatement).visit(builder);
    }
  }
}

export class WhileStatementVisitor extends Visitor<WhileStatement> {
  constructor(parent: IVisitor, node: WhileStatement) {
    super(parent, node, 'WhileStatement');
  }

  visit (builder: IBuilder) {
    const expression = ExpressionFactory.create(this, this.node.expression);
    // condition
    builder.add('while (');
    expression.visit(builder);
    builder.add(') ');

    if (expression.returnType !== 'boolean') {
      this.addError(Messages.Errors.ConditionTypeMismatch, expression.returnType, 'boolean')
    }

    // body is either block or a single expression
    if (this.node.body) {
      BlockFactory.create(this, this.node.body).visit(builder);
    }
  }
}

export class SwitchStatementVisitor extends Visitor<SwitchStatement> {
  constructor(parent: IVisitor, node: SwitchStatement) {
    super(parent, node, 'SwitchStatement');
  }

  visit (builder: IBuilder) {
    const expression = ExpressionFactory.create(this, this.node.expression);
    // condition
    builder.add('switch (');
    expression.visit(builder);
    builder.add(') {\n');

    // body is either block or a single expression
    const statements = BlockFactory.createArray(this, this.node.statements);
    builder.join(statements, '\n');

    builder.pad(this.indent);
    builder.add('}\n');
  }
}

export class SwitchCaseVisitor extends Visitor<SwitchCase> {
  constructor(parent: IVisitor, node: SwitchCase) {
    super(parent, node, 'SwitchCase');
  }

  visit (builder: IBuilder) {
    // condition
    // it's either a case node or default node
    if (this.node.expression) {
      builder.pad(this.indent);
      builder.add('case ');
      console.log(this.node);
      const expression = ExpressionFactory.create(this, this.node.expression);
      expression.visit(builder);
    } else {
      builder.add('default');
    }
    builder.add(':');
  }
}

export class BreakStatementVisitor extends Visitor<BreakStatement> {
  constructor(parent: IVisitor, node: BreakStatement) {
    super(parent, node, 'BreakStatement');

    if (this.node.label) {
      this.addError(Messages.Errors.LabelsNotSupported);
    }
  }

  visit (builder: IBuilder) {
    // condition
    builder.add('break;');
  }
}

export class ContinueStatementVisitor extends Visitor<ContinueStatement> {
  constructor(parent: IVisitor, node: ContinueStatement) {
    super(parent, node, 'ContinueStatement');

    if (this.node.label) {
      this.addError(Messages.Errors.LabelsNotSupported);
    }
  }

  visit (builder: IBuilder) {
    // condition
    builder.add('continue;');
  }
}

export class ReturnStatementVisitor extends Visitor<ReturnStatement> {
  constructor(parent: IVisitor, node: ReturnStatement) {
    super(parent, node, 'ReturnStatement');
  }

  visit (builder: IBuilder) {
    // condition
    builder.add('return ');

    const expression = ExpressionFactory.create(this, this.node.expression);
    expression.visit(builder);
    builder.add(';');
  }
}
