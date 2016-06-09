import FieldDeclarationVisitor from './FieldDeclarationVisitor';
import ModifiersVisitor, { ModifierLevel } from './ModifiersVisitor';

declare global {
  interface VariableDeclarationStatement extends FieldDeclaration {}
}

export class VariableDeclarationStatementVisitor extends FieldDeclarationVisitor {
  constructor(parent: IVisitor, node: VariableDeclarationStatement) {
    super(parent, node, 'VariableDeclarationStatement');

    // reinit modifiers
    this.modifiers = new ModifiersVisitor(this, node.modifiers, [], ModifierLevel.Variable);
  }

  visit (builder: IBuilder) {
    if (this.modifiers.isFinal) {
      builder.add('const ');
    } else {
      builder.add('let ');
    }
    super.visit(builder);
  }
}

export default VariableDeclarationStatementVisitor;
