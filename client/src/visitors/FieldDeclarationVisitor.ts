import Visitor from './Visitor';

import ModifiersFactory from './factories/ModifiersFactory';
import TypeFactory from './factories/TypeFactory';
import NameFactory from './factories/NameFactory';
import ExpressionFactory from './factories/ExpressionFactory';
import FragmentsFactory from './factories/DeclarationsFactory';

declare global {
  interface VariableDeclarationFragment extends AstElement {
    node: 'VariableDeclarationFragment';
    name: SimpleName;
    extraDimensions: number;
    initializer: any;
  }

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
    const modifiers = ModifiersFactory.create(this, this.node.modifiers);
    const fragments = FragmentsFactory.createArray(this, this.node.fragments, this.node.type);

    builder.pad(this.indent);
    builder.join(modifiers, '');
    builder.join(fragments, ', ');
    builder.add(';\n');
  }
}

// export default class FieldDeclarationsVisitor extends Visitor {
//   visit(types: FieldDeclaration[]): string {
//     return types.map((type) => new FieldDeclarationVisitor(this.parent).visit(type)).join();
//   }
// }

// fragments

export class FragmentVisitor extends Visitor<VariableDeclarationFragment> {
  name: IVisitor;
  initialiser: IVisitor;
  type: BaseTypeNode;

  constructor(parent: IVisitor, node: VariableDeclarationFragment, typeDefinition: Types) {
    super(parent, node, 'VariableDeclarationFragment');

    this.name = NameFactory.create(this, node.name);
    this.type = TypeFactory.create(this, typeDefinition);

    if (node.initializer) {
      this.initialiser = ExpressionFactory.create(this, node.initializer);
    }
  }

  visit(builder: IBuilder) {
    const fragment = this.node;
    let extraDimensions = '';

    if (fragment.extraDimensions) {
      // adds [] from variable a[][] to type
      for (let i = 0; i < fragment.extraDimensions; i++) { extraDimensions += '[]' }
    }

    // prefix name : type = initialiser;
    this.name.visit(builder);

    // add :
    builder.add(': ');

    // add type
    this.type.visit(builder);

    // add extra dimension
    builder.add(extraDimensions);
    // add iniitliser
    builder.add(' = ');

    if (this.initialiser) {
      this.initialiser.visit(builder);
    } else {
      // initialise types to default values
      let dinitialiser = '';
      switch (this.type.name) {
        case 'number':
          dinitialiser = '0';
          break;
        default:
          dinitialiser = 'null';
      }
      builder.add(dinitialiser);
    }
  }
}
