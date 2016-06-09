import * as Expressions from '../ExpressionsVisitors';

export default class ExpressionFactory {
  static create(parent: IVisitor, node: AstElement): IExpressionVisitor {
    switch (node.node) {
      case 'SimpleName':
        return new Expressions.SimpleVariableReference(parent, node as SimpleName);
      case 'QualifiedName':
        return new Expressions.QualifiedVariableReference(parent, node as QualifiedName);
      case 'ThisExpression':
        return new Expressions.ThisExpressionVisitor(parent, node as ThisExpression);
      case 'SuperFieldAccess':
        return new Expressions.SuperFieldAccessVisitor(parent, node as SuperFieldAccess);
      case 'FieldAccess':
        return new Expressions.FieldAccessVisitor(parent, node as FieldAccess);
      case 'PrefixExpression':
        return new Expressions.PrefixExpressionVisitor(parent, node as PrefixExpression);
      case 'PostfixExpression':
        return new Expressions.PostfixExpressionVisitor(parent, node as PrefixExpression);
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
      case 'MethodInvocation':
        return new Expressions.MethodInvocationVisitor(parent, node as MethodInvocation);
      default:
        throw new Error(node.node + ' is not implemented');
    }
  }

  static createArray(parent: IVisitor, node: AstElement[]): IExpressionVisitor[] {
    //console.log(parent)
    return node.map((e) => ExpressionFactory.create(parent, e));
  }
}
