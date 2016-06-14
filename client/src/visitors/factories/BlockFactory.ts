import VariableDeclarationStatementVisitor from '../VariableDeclarationStatementVisitor';
import { ExpressionStatementVisitor } from '../ExpressionsVisitors';
import { BlockVisitor } from '../BlockVisitor';
import * as Statements from '../StatementsVisitor';

declare global {
  type BlockElement = ExpressionStatement | IfStatement;
}

export default class BlockFactory {
  static create(parent: IVisitor, node: AstElement): IVisitor {
    switch (node.node) {
      case 'Block':
        return new BlockVisitor(parent, <Block>node);
      case 'VariableDeclarationStatement':
        return new VariableDeclarationStatementVisitor(parent, <VariableDeclarationStatement>node);
      case 'ExpressionStatement':
        return new ExpressionStatementVisitor(parent, node as ExpressionStatement);
      case 'IfStatement':
        return new Statements.IfStatementVisitor(parent, node as IfStatement);
      case 'WhileStatement':
        return new Statements.WhileStatementVisitor(parent, node as WhileStatement);
      case 'SwitchStatement':
        return new Statements.SwitchStatementVisitor(parent, node as SwitchStatement);
      case 'SwitchCase':
        return new Statements.SwitchCaseVisitor(parent, node as SwitchCase);
      case 'BreakStatement':
        return new Statements.BreakStatementVisitor(parent, node as BreakStatement);
      case 'ContinueStatement':
        return new Statements.ContinueStatementVisitor(parent, node as ContinueStatement);
      case 'ReturnStatement':
        return new Statements.ReturnStatementVisitor(parent, node as ReturnStatement);
      default:
        throw new Error('Unsupported block statement: ' + node.node);
    }
  }

  static createArray(parent: IVisitor, node: AstElement[]): IVisitor[] {
    return node.map((a) => BlockFactory.create(parent, a));
  }
}
