import Visitor from './Visitor';
import BlockFactory from './factories/BlockFactory';
import ExpressionFactory from './factories/ExpressionFactory';
import BlockVisitor from './BlockVisitor';

declare global {
  interface IfStatement extends AstElement {
    node: 'IfStatement';
    elseStatement: Block;
    thenStatement: Block;
    expression: Expression;
  }
}

export class IfStatementVisitor extends Visitor<IfStatement> {
  constructor(parent: IVisitor, node: IfStatement) {
    super(parent, node, 'IfStatement');
  }

  visit (builder: IBuilder) {
    // TODO: check that type in the if stetement is boolean
    // condition
    builder.add('if (');
    ExpressionFactory.create(this, this.node.expression).visit(builder);
    builder.add(') ');

    // if statement
    if (this.node.thenStatement) {
      BlockFactory.create(this, this.node.thenStatement).visit(builder);
    }

    // else statement
    if (this.node.elseStatement) {
      builder.addLine();
      console.log(this.indent)
      builder.pad(this.indent);
      builder.add('else ');
      BlockFactory.create(this, this.node.elseStatement).visit(builder);
    }
  }
}
