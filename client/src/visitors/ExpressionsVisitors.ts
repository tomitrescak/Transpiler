import Visitor from './Visitor';
import ExpressionFactory from './factories/ExpressionFactory';

declare global {
  interface NumberLiteral extends AstElement {
    node: 'NumberLiteral';
    token: string;
  }

  interface BooleanLiteral extends AstElement {
    node: 'BooleanLiteral';
    booleanValue: string;
  }

  interface PrefixExpression extends AstElement {
    operator: string;
    operand: Names;
  }

  interface InfixExpression extends AstElement {
    node: 'NumberLiteral';
    operator: string;
    leftOperand: NumberLiteral;
    rightOperand: NumberLiteral;
  }

  interface ParenthesizedExpression extends AstElement {
    expression: Expression;
  }

  type Expression = NumberLiteral | InfixExpression | ParenthesizedExpression;
}

export class NumberLiteralVisitor extends Visitor<NumberLiteral> {
  constructor(parent: IVisitor, node: NumberLiteral) {
    super(parent, node, 'NumberLiteral');
  }

  visit(builder: IBuilder) {
    builder.add(this.node.token, this.location);
  }
}

export class InfixExpressionVisitor extends Visitor<InfixExpression> {
  constructor(parent: IVisitor, node: InfixExpression) {
    super(parent, node, 'InfixExpression');
  }
  visit(builder: IBuilder) {
    const left = ExpressionFactory.create(this, this.node.leftOperand);
    const right = ExpressionFactory.create(this, this.node.rightOperand);

    left.visit(builder);
    builder.add(' ' + this.node.operator + ' ');
    right.visit(builder);
  }
}

export class PrefixExpressionVisitor extends Visitor<PrefixExpression> {
  constructor(parent: IVisitor, node: PrefixExpression) {
    super(parent, node, 'PrefixExpression');
  }

  visit(builder: IBuilder) {
    const operand = ExpressionFactory.create(this, this.node.operand);

    builder.add(this.node.operator, this.location);
    operand.visit(builder);

    return this;
  }
}

export class ParenthesizedExpressionVisitor extends Visitor<ParenthesizedExpression> {
  constructor(parent: IVisitor, node: ParenthesizedExpression) {
    super(parent, node, 'ParenthesizedExpression');
  }

  visit(builder: IBuilder) {
    const expression = ExpressionFactory.create(this, this.node.expression);
    builder.add('(');
    expression.visit(builder);
    builder.add(')');
  }
}

export class BooleanLiteralVisitor extends Visitor<BooleanLiteral> {
  constructor(parent: IVisitor, node: BooleanLiteral) {
    super(parent, node, 'BooleanLiteral');
  }

  visit(builder: IBuilder) {
    builder.add(this.node.booleanValue, this.location);
  }
}
