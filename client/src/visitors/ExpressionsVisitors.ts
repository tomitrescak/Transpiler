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
  }
}
