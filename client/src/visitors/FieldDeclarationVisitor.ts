import Visitor from './Visitor';
import Builder from '../config/Builder';

import ModifiersVisitor from './ModifiersVisitor';
import TypesVisitor from './TypesVisitor';
import NameVisitor from './NameVisitor';
import ExpressionVisitor from './ExpressionsVisitors';

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

    Builder.pad(this.indent);
    ModifiersVisitor.visit(this, node.modifiers);
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
    NameVisitor.visit(this, fragment.name);

    // add :
    Builder.add(': ');

    // add type
    let type = TypesVisitor.visit(this, typeDefinition).name;

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
      ExpressionVisitor.visit(this, fragment.initializer);
    }
  }
}

class FragmentsVisitor extends Visitor {
  visit(fragments: VariableDeclarationFragment[], type: Types) {
    Builder.join(fragments, (fragment: VariableDeclarationFragment) =>
      new FragmentVisitor(this.parent).visit(fragment, type), ', ');
  }
}
