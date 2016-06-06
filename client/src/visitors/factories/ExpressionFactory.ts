import * as Expressions from '../ExpressionsVisitors';
import NameFactory from './NameFactory';

export default class ExpressionVisitor {
  static create(parent: IVisitor, node: AstElement): IVisitor {
    switch (node.node) {
      case 'SimpleName':
      case 'QualifiedName':
        return NameFactory.create(parent, <Names> node);
      case 'PrefixExpression':
        return new Expressions.PrefixExpressionVisitor(parent, <PrefixExpression> node);
      case 'BooleanLiteral':
        return new Expressions.BooleanLiteralVisitor(parent, <BooleanLiteral> node);
      case 'NumberLiteral':
        return new Expressions.NumberLiteralVisitor(parent, <NumberLiteral> node);
      case 'InfixExpression':
        return new Expressions.InfixExpressionVisitor(parent, <InfixExpression> node);
      case 'ParenthesizedExpression':
        return new Expressions.ParenthesizedExpressionVisitor(parent, <ParenthesizedExpression> node);
      default:
        throw new Error(node.node + ' is not implemented');
    }
  }
}
