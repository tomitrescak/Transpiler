import Visitor from './Visitor';
import Builder from '../config/Builder';

import { ModifiersVisitor } from './ModifiersVisitor';
import NameVisitor from './NameVisitor';
import { TypeParametersVisitor } from './TypeParameterVisitor';
import { TypeVisitor, TypesVisitor } from './TypesVisitor';
import BodyDeclarationsVisitor from './BodyDeclarationsVisitor';

declare global {
  interface TypeDeclaration extends AstNode {
    node: 'TypeDeclaration';
    bodyDeclarations: any[];
    interface: boolean;
    modifiers: (Modifier | MarkerAnnotation)[];
    name: SimpleName;
    superInterfaceTypes: (SimpleType | ParametrizedType)[];
    superClassType: SimpleType | ParametrizedType;
    typeParameters: TypeParameter[];
  }
}

export class TypeDeclarationsVisitor extends Visitor {
  visit(types: TypeDeclaration[]) {
    Builder.join(types, (type: TypeDeclaration) => new TypeDeclarationVisitor(this.parent).visit(type), '\n');
  }
}

export class TypeDeclarationVisitor extends Visitor {
  visit(node: TypeDeclaration) {
    super.check(node, 'TypeDeclaration');

    // increase padding
    this.incIndent();

    // render header
    const pad = Builder.add(this.parent.pad());

    // add modifiers
    ModifiersVisitor.visit(this, node.modifiers, ['abstract'], ['static']);

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
      Builder.add(this.parent.pad() + ' {');
      Builder.addLine();
      // render children
      new BodyDeclarationsVisitor(this).visit(node.bodyDeclarations); // wrap children with new lines
      Builder.add(this.parent.pad() + '}');
      Builder.addLine();
    } else {
      Builder.add(' {}\n')
    }
  }
}
