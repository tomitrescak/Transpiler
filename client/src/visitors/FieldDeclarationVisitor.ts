import Visitor from './Visitor';
import Builder from '../config/Builder';

import ModifiersVisitor from './ModifiersVisitor';
import TypesVisitor from './TypesVisitor';
import NameVisitor from './NameVisitor';
import InitialiserVisitor from './InitializerVisitor';

declare global {
  interface VariableDeclarationFragment extends AstNode {
    node: 'VariableDeclarationFragment';
    name: SimpleName;
    extraDimensions: number;
    initializer: any;
  }

  interface FieldDeclaration extends AstNode {
    node: 'FieldDeclaration';
    fragments: VariableDeclarationFragment[];
    type: PrimitiveType | SimpleType | ParametrizedType | ArrayType;
    modifiers: Modifier[];
  }
}

export default class FieldDeclarationVisitor extends Visitor {
  visit(node: FieldDeclaration) {
    super.check(node, 'FieldDeclaration');

    Builder.add(this.pad());
    new ModifiersVisitor(this).visit(node.modifiers);
    new FragmentsVisitor(this).visit(node.fragments, node.type);
    Builder.add(';\n');
  }
}

// export default class FieldDeclarationsVisitor extends Visitor {
//   visit(types: FieldDeclaration[]): string {
//     return types.map((type) => new FieldDeclarationVisitor(this.parent).visit(type)).join();
//   }
// }

// fragments

class FragmentVisitor extends Visitor {
  visit(fragment: VariableDeclarationFragment, typeDefinition: Types) {
    let extraDimensions = '';
    if (fragment.extraDimensions) {
      // adds [] from variable a[][] to type
      for (let i = 0; i < fragment.extraDimensions; i++) { extraDimensions += '[]' }
    }

    // prefix name : type = initialiser;
    new NameVisitor(this).visit(fragment.name);
    // add :
    Builder.add(': ');
    // add type
    let type = new TypesVisitor(this).visit(typeDefinition).name;
    // add extra dimension
    Builder.add(extraDimensions);
    // add iniitliser
    Builder.add(' = ');

    // initialise types to default values
    if (fragment.initializer === null || fragment.initializer === undefined) {
      let initialiser = '';
      switch (type) {
        case 'number':
          initialiser = '0';
          break;
        default:
          initialiser = 'null';
      }
      Builder.add(initialiser);
    } else {
      new InitialiserVisitor(this).visit(fragment.initializer);
    }
  }
}

class FragmentsVisitor extends Visitor {
  visit(fragments: VariableDeclarationFragment[], type: Types) {
    Builder.join(fragments, (fragment: VariableDeclarationFragment) =>
      new FragmentVisitor(this.parent).visit(fragment, type), ', ');
  }
}
