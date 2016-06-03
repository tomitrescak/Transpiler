import Visitor from './Visitor';
import { NumberLiteralVisitor, InfixExpressionVisitor } from './ExpressionsVisitors';

export default class InitialiserVisitor extends Visitor {
  visit(node: AstNode): string {
    switch (node.node) {
      case 'NumberLiteral':
        return new NumberLiteralVisitor(this).visit(<NumberLiteral> node);
      case 'InfixExpression':
        return new InfixExpressionVisitor(this).visit(<InfixExpression> node);
      default:
        throw new Error(node.node + ' is not implemented');
    }
  }
}
