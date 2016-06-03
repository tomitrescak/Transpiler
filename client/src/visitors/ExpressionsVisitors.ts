import Visitor from './Visitor';
import Builder from '../config/Builder';
import NameVisitor from './NameVisitor';

declare global {
  interface NumberLiteral extends AstNode {
    node: 'NumberLiteral';
    token: string;
  }

  interface BooleanLiteral extends AstNode {
    node: 'BooleanLiteral',
    booleanValue: string;
  }

  interface PrefixExpression extends AstNode {
    operator: string;
    operand: Names;
  }

  interface InfixExpression extends AstNode {
    node: 'NumberLiteral';
    operator: string;
    leftOperand: NumberLiteral;
    rightOperand: NumberLiteral;
  }

  interface ParenthesizedExpression extends AstNode {
    expression: Expression;
  }

  type Expression = NumberLiteral | InfixExpression | ParenthesizedExpression;
}

export class NumberLiteralVisitor extends Visitor {
  visit(node: NumberLiteral) {
    super.check(node, 'NumberLiteral');
    Builder.add(node.token, node);
    return this;
  }
}

export class InfixExpressionVisitor extends Visitor {
  visit(node: InfixExpression) {
    super.check(node, 'InfixExpression');
    ExpressionVisitor.visit(this, node.leftOperand);
    Builder.add(' ' + node.operator + ' ');
    ExpressionVisitor.visit(this, node.rightOperand);
    return this;
  }
}

export class PrefixExpressionVisitor extends Visitor {
  visit(node: PrefixExpression) {
    super.check(node, 'PrefixExpression');
    Builder.add(node.operator);
    ExpressionVisitor.visit(this, node.operand);
    return this;
  }
}

export class ParenthesizedExpressionVisitor extends Visitor {
  visit(node: ParenthesizedExpression) {
    super.check(node, 'ParenthesizedExpression');
    Builder.add('(');
    ExpressionVisitor.visit(this, node.expression);
    Builder.add(')');
    return this;
  }
}

export class BooleanLiteralVisitor extends Visitor {
  visit(node: BooleanLiteral) {
    super.check(node, 'BooleanLiteral');
    Builder.add(node.booleanValue, node);
    return this;
  }
}

export default class ExpressionVisitor {
  static visit(parent: Visitor, node: AstNode): Visitor {
    switch (node.node) {
      case 'SimpleName':
      case 'QualifiedName':
        return NameVisitor.visit(parent, <Names> node);
      case 'PrefixExpression':
        return new PrefixExpressionVisitor(parent).visit(<PrefixExpression> node);
      case 'BooleanLiteral':
        return new BooleanLiteralVisitor(parent).visit(<BooleanLiteral> node);
      case 'NumberLiteral':
        return new NumberLiteralVisitor(parent).visit(<NumberLiteral> node);
      case 'InfixExpression':
        return new InfixExpressionVisitor(parent).visit(<InfixExpression> node);
      case 'ParenthesizedExpression':
        return new ParenthesizedExpressionVisitor(parent).visit(<ParenthesizedExpression> node);
      default:
        throw new Error(node.node + ' is not implemented');
    }
  }
}
