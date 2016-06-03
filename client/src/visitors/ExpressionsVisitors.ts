import Visitor from './Visitor';
import Builder from '../config/Builder';

declare global {
  interface NumberLiteral extends AstNode {
    node: 'NumberLiteral';
    token: string;
  }

  interface InfixExpression extends AstNode {
    node: 'NumberLiteral';
    operator: string;
    leftOperand: NumberLiteral;
    rightOperand: NumberLiteral;
  }
}

export class NumberLiteralVisitor extends Visitor {
  visit(node: NumberLiteral) {
    super.check(node, 'NumberLiteral');
    Builder.add(node.token, node);
  }
}

export class InfixExpressionVisitor extends Visitor {
  visit(node: InfixExpression) {
    super.check(node, 'InfixExpression');
    ExpressionVisitor.visit(this, node.leftOperand);
    Builder.add(' ' + node.operator + ' ');
    ExpressionVisitor.visit(this, node.rightOperand);
  }
}

export default class ExpressionVisitor {
  static visit(parent: Visitor, node: AstNode) {
    switch (node.node) {
      case 'NumberLiteral':
        new NumberLiteralVisitor(parent).visit(<NumberLiteral> node);
        break
      case 'InfixExpression':
        new InfixExpressionVisitor(parent).visit(<InfixExpression> node);
        break;
      default:
        throw new Error(node.node + ' is not implemented');
    }
  }
}
