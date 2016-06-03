import Visitor from './Visitor';
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

    const modifiers: string = new ModifiersVisitor(this).visit(node.modifiers);
    const type = new TypesVisitor(this).visit(node.type);
    const fragments: string = new FragmentsVisitor(this).visit(node.fragments, type);

    return `${this.pad()}${modifiers}${fragments};${Visitor.newLine()}`;
  }
}

// export default class FieldDeclarationsVisitor extends Visitor {
//   visit(types: FieldDeclaration[]): string {
//     return types.map((type) => new FieldDeclarationVisitor(this.parent).visit(type)).join();
//   }
// }

// fragments

class FragmentVisitor extends Visitor {
  visit(fragment: VariableDeclarationFragment, type = ''): string {
    let extraDimensions = '';
    if (fragment.extraDimensions) {
      // adds [] from variable a[][] to type
      for (let i = 0; i < fragment.extraDimensions; i++) { extraDimensions += '[]' }
    }

    const name = new NameVisitor(this).visit(fragment.name);

    // initialise types to default values
    let initialiser: String = '';
    if (fragment.initializer === null || fragment.initializer === undefined) {
      switch (type) {
        case 'number':
          initialiser = '0';
          break;
        default:
          initialiser = 'null';
      }
    } else {
      initialiser = new InitialiserVisitor(this).visit(fragment.initializer);
    }

    const finalType = type + extraDimensions;
    return `${name}: ${finalType} = ${initialiser}`;
  }
}

class FragmentsVisitor extends Visitor {
  visit(fragments: VariableDeclarationFragment[], type = ''): string {
    return fragments.map((fragment) => new FragmentVisitor(this.parent).visit(fragment, type)).join(', ');
  }
}
