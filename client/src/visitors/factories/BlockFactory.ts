import VariableDeclarationStatementVisitor from '../VariableDeclarationStatementVisitor';

export default class BlockFactory {
  static create(parent: IVisitor, node: AstElement): IVisitor {
    if (node.node === 'VariableDeclarationStatement') {
      return new VariableDeclarationStatementVisitor(parent, <VariableDeclarationStatement>node);
    } else if (node.node === 'ExpressionStatement') {

      throw new Error('Unsupported node: ' + node.node);

    } else {
      throw new Error('Unsupported node: ' + node.node);
    }
  }

  static createArray(parent: IVisitor, node: AstElement[]): IVisitor[] {
    return node.map((a) => BlockFactory.create(parent, a));
  }
}
