import Visitor from './Visitor';
import ModifiersVisitor from './ModifiersVisitor';
import TypeFactory from './factories/TypeFactory';
import VariableDeclarationFragmentVisitor from './VariableDeclarationFragmentVisitor';

declare global {
  interface SingleVariableDeclaration extends VariableDeclarationFragment {
    node: 'SingleVariableDeclaration';
    type: Types;
    modifiers: Modifier[];
    varargs: boolean;
  }
}

export class SingleVariableDeclarationVisitor extends VariableDeclarationFragmentVisitor {
  type: TypeVisitor;
  modifiers: ModifiersVisitor;
  varargs: boolean;

  constructor(parent: IVisitor, node: SingleVariableDeclaration) {
    super(parent, node, node.type, 'SingleVariableDeclaration');

    this.varargs = node.varargs;
    if (node.modifiers.length) {
      this.modifiers = new ModifiersVisitor(this, node.modifiers);
    }
  }

  visit(builder: IBuilder) {
    // render extra values specific for parameters
    if (this.modifiers) {
      this.modifiers.visit(builder);
      builder.add(' ');
    }
    if (this.varargs) {
      builder.add('...');
    }

    // render variable declaration without initialiser
    super.visit(builder, false);

    // vararags add [] at the end
    if (this.varargs) {
      builder.add('[]');
    }
  }
}

export default class SingleVariableDeclarationsVisitor {
  parameters: SingleVariableDeclarationVisitor[];

  constructor(parent: IVisitor, params: SingleVariableDeclaration[]) {
    this.parameters = params.map((p) => new SingleVariableDeclarationVisitor(parent, p));
  }

  visit(builder: IBuilder) {
    builder.join(this.parameters, ', ');
  }
}
