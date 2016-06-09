import Visitor from './Visitor';
import BlockFactory from './factories/BlockFactory';
import VariableDeclarationFragmentVisitor from './VariableDeclarationFragmentVisitor';

declare global {
  interface Block extends AstElement {
    node: 'Block';
    statements: AstElement[];
  }
}

export class BlockVisitor extends Visitor<Block> implements VariableHolderVisitor {
  statements: IVisitor[];
  variables: VariableDeclarationFragmentVisitor[];

  constructor(parent: IVisitor, node: Block) {
    super(parent, node, 'Block');

    this.variables = [];
    if (node.statements.length) {
      this.statements = BlockFactory.createArray(this, node.statements);
    }
  }

  visit(builder: IBuilder) {
    this.incIndent();
    builder.add('{');
    if (this.node.statements.length) {
      builder.addLine();
      builder.pad(this.indent);
      builder.join(this.statements, '\n' + this.pad());
      builder.addLine();
      builder.pad(this.parent.indent);
    }

    builder.add('}');
  }
}

export default BlockVisitor;
