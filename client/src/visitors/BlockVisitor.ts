import Visitor from './Visitor';

declare global {
  interface Block extends AstElement {
    node: 'Block';
    statements: IVisitor[];
  }
}

export default class BlockVisitor extends Visitor<Block> {
  constructor(parent: IVisitor, node: Block) {
    super(parent, node, 'Block');
  }

  visit(builder: IBuilder) {
    builder.add('{');
    if (this.node.statements.length) {
      builder.addLine();

      builder.pad(this.indent);
    }

    builder.add('}\n');
  }
}
