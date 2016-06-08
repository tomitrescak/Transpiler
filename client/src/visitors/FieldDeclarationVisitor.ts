import Visitor from './Visitor';
import FragmentsFactory from './factories/DeclarationsFactory';

import ModifiersVisitor from './ModifiersVisitor';

declare global {
  interface FieldDeclaration extends AstElement {
    node: 'FieldDeclaration';
    fragments: VariableDeclarationFragment[];
    type: PrimitiveType | SimpleType | ParametrizedType | ArrayType;
    modifiers: Modifier[];
  }
}

export class FieldDeclarationVisitor extends Visitor<FieldDeclaration> {
  constructor(parent: IVisitor, node: FieldDeclaration) {
    super(parent, node, 'FieldDeclaration');
  }

  visit(builder: IBuilder) {
    const modifiers = new ModifiersVisitor(this, this.node.modifiers);
    const fragments = FragmentsFactory.createArray(this, this.node.fragments, this.node.type);

    modifiers.visit(builder);
    builder.join(fragments, ';\n');
    builder.add(';\n');
  }
}

// export default class FieldDeclarationsVisitor extends Visitor {
//   visit(types: FieldDeclaration[]): string {
//     return types.map((type) => new FieldDeclarationVisitor(this.parent).visit(type)).join();
//   }
// }

// fragments
