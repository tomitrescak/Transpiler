import Visitor from './Visitor';

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
  visit(node: NumberLiteral): string {
    super.check(node, 'NumberLiteral');
    return node.token;
  }
}

export class InfixExpressionVisitor extends Visitor {
  visit(node: NumberLiteral): string {
    super.check(node, 'InfixExpression');
    return '';
  }
}
