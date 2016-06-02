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
    rightOperand: NumberLiteral
  }
}

export class NumberLiteralVisitor {
  static visit(node: NumberLiteral): string {
    return node.token;
  }
}
