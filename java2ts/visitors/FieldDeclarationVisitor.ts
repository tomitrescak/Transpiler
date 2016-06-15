import Visitor from './Visitor';
import FragmentsFactory from './factories/DeclarationsFactory';

import ModifiersVisitor, { ModifierLevel } from './ModifiersVisitor';

declare global {
  interface FieldDeclaration extends AstElement {
    node: 'FieldDeclaration';
    fragments: VariableDeclarationFragment[];
    type: PrimitiveType | SimpleType | ParametrizedType | ArrayType;
    modifiers: Modifier[];
  }
}

export class FieldDeclarationVisitor extends Visitor<FieldDeclaration> {
  modifiers: ModifiersVisitor;
  fragments: IVisitor[];

  constructor(parent: IVisitor, node: FieldDeclaration, nodeName = 'FieldDeclaration', allowedModifiers = ['abstract', 'static', 'final', 'private', 'public', 'protected'], modifierLevel = ModifierLevel.Property) {
    super(parent, node, nodeName);

    this.modifiers = new ModifiersVisitor(this, this.node.modifiers, allowedModifiers, modifierLevel);
    this.fragments = FragmentsFactory.createArray(this, this.node.fragments, this.node.type, this.modifiers.isStatic, this.modifiers.isFinal);
  }

  visit(builder: IBuilder) {
    this.modifiers.visit(builder);
    builder.join(this.fragments, ';\n' + this.pad());
    builder.add(';');
  }
}

export default FieldDeclarationVisitor;

// export default class FieldDeclarationsVisitor extends Visitor {
//   visit(types: FieldDeclaration[]): string {
//     return types.map((type) => new FieldDeclarationVisitor(this.parent).visit(type)).join();
//   }
// }

// fragments
