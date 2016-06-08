import * as Expressions from '../ExpressionsVisitors';
import NameFactory from './NameFactory';

export default class ExpressionVisitor {
  static create(parent: IVisitor, node: AstElement): IExpressionVisitor {
    switch (node.node) {
      case 'SimpleName':
      case 'QualifiedName':
        return NameFactory.create(parent, <Names> node);
      case 'PrefixExpression':
        return new Expressions.PrefixExpressionVisitor(parent, node as PrefixExpression);
      case 'BooleanLiteral':
        return new Expressions.BooleanLiteralVisitor(parent, node as BooleanLiteral);
      case 'StringLiteral':
        return new Expressions.StringLiteralVisitor(parent, node as StringLiteral);
      case 'CharacterLiteral':
        return new Expressions.CharacterLiteralVisitor(parent, node as CharacterLiteral);
      case 'NumberLiteral':
        return new Expressions.NumberLiteralVisitor(parent, node as NumberLiteral);
      case 'InfixExpression':
        return new Expressions.InfixExpressionVisitor(parent, node as InfixExpression);
      case 'ParenthesizedExpression':
        return new Expressions.ParenthesizedExpressionVisitor(parent, node as ParenthesizedExpression);
      default:
        throw new Error(node.node + ' is not implemented');
    }
  }
}
