import Visitor from './Visitor';
import { NumberLiteralVisitor, InfixExpressionVisitor } from './ExpressionsVisitors';

export default class InitialiserVisitor extends Visitor {
  visit(node: AstNode) {
    switch (node.node) {
      case 'NumberLiteral':
        new NumberLiteralVisitor(this).visit(<NumberLiteral> node);
        break
      case 'InfixExpression':
        new InfixExpressionVisitor(this).visit(<InfixExpression> node);
        break;
      default:
        throw new Error(node.node + ' is not implemented');
    }
  }
}
