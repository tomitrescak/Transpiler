import VariableDeclarationStatementVisitor from '../VariableDeclarationStatementVisitor';
import { ExpressionStatementVisitor } from '../ExpressionsVisitors';
import { BlockVisitor } from '../BlockVisitor';
import * as Statements from '../StatementsVisitor';

declare global {
  type BlockElement = ExpressionStatement | IfStatement;
}

export default class BlockFactory {
  static create(parent: IVisitor, node: AstElement): IVisitor {
    if (node.node === 'Block') {
      return new BlockVisitor(parent, <Block>node);
    } else if (node.node === 'VariableDeclarationStatement') {
      return new VariableDeclarationStatementVisitor(parent, <VariableDeclarationStatement>node);
    } else if (node.node === 'ExpressionStatement') {
      return new ExpressionStatementVisitor(parent, node as ExpressionStatement);
    } else if (node.node === 'IfStatement') {
      return new Statements.IfStatementVisitor(parent, node as IfStatement);
    } else {
      throw new Error('Unsupported node: ' + node.node);
    }
  }

  static createArray(parent: IVisitor, node: AstElement[]): IVisitor[] {
    return node.map((a) => BlockFactory.create(parent, a));
  }
}
