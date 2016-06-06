import Visitor from './Visitor';
import Builder from '../config/Builder';

import { ModifiersVisitor } from './ModifiersVisitor';
import NameVisitor from './NameVisitor';
import { TypeParametersVisitor } from './TypeParameterVisitor';
import { TypeVisitor, TypesVisitor } from './TypesVisitor';
import BodyDeclarationsVisitor from './BodyDeclarationsVisitor';
import EnumDeclarationVisitor from './EnumDeclarationVisitor';

declare global {
  interface BaseTypeDeclaration extends AstNode {
    bodyDeclarations: any[];
    modifiers: (Modifier | MarkerAnnotation)[];
    name: SimpleName;
    superInterfaceTypes: (SimpleType | ParametrizedType)[];
  }

  interface TypeDeclaration extends BaseTypeDeclaration {
    node: 'TypeDeclaration';
    interface: boolean;
    superClassType: SimpleType | ParametrizedType;
    typeParameters: TypeParameter[];
  }

  type TypeDeclarations = TypeDeclaration | EnumDeclaration;
}

export class TypeDeclarationsVisitor {
  static visit(parent: Visitor, types: TypeDeclarations[]) {
    Builder.join(types, (type: TypeDeclarations) => {
      switch (type.node) {
        case 'TypeDeclaration':
          return new TypeDeclarationVisitor(parent).visit(<TypeDeclaration> type);
        case 'EnumDeclaration':
          return new EnumDeclarationVisitor(parent).visit(<EnumDeclaration> type);
        default:
          throw new Error(type.node + ' is not implemented');
      }
    }, '\n');
  }
}

export class TypeDeclarationVisitor extends Visitor {
  visit(node: TypeDeclaration) {
    super.check(node, 'TypeDeclaration');

    // increase padding
    this.incIndent();

    // render header
    Builder.pad(this.parent.indent);

    // add modifiers
    ModifiersVisitor.visit(this, node.modifiers, ['abstract'], ['public', 'protected', 'private', 'final']);

    // add descriptors
    Builder.add(node.interface ? 'interface ' : 'class ');

    // add name
    NameVisitor.visit(this, node.name);

    // add type parameters
    TypeParametersVisitor.visit(this, node.typeParameters);

    // add superclass
    if (node.superClassType) {
      Builder.add(' extends ');
      TypeVisitor.visit(this, node.superClassType);
    }
    // add interfaces
    if (node.superInterfaceTypes.length) {
      Builder.add(' implements ');
      TypesVisitor.visit(this, node.superInterfaceTypes);
    }

    // visit all children
    if (node.bodyDeclarations.length) {
      // we append new line after the initial bracket '{\n'
      Builder.pad(this.parent.indent);
      Builder.add(' {');
      Builder.addLine();
      // render children
      new BodyDeclarationsVisitor(this).visit(node.bodyDeclarations); // wrap children with new lines
      Builder.pad(this.parent.indent);
      Builder.add('}');
      Builder.addLine();
    } else {
      Builder.add(' {}\n')
    }
  }
}
