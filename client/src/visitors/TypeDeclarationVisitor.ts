import VisitorNode from './Visitor';

import ModifierFactory from './factories/ModifiersFactory';
import NameFactory from './factories/NameFactory';
import TypeParametersVisitor from './TypeParameterVisitor';
import TypeFactory from './factories/TypeFactory';
import BodyDeclarationsFactory from './factories/BodyDeclarationsFactory';

declare global {
  interface BaseTypeDeclaration extends AstElement {
    bodyDeclarations: BodyDeclarations[];
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

export class TypeDeclarationVisitor extends VisitorNode<TypeDeclaration> {
  modifiers: IVisitor[];
  typeDeclarationName: string;
  name: NameVisitor;
  typeParameters: TypeParametersVisitor;
  superClassType: string;
  superInterfaceTypes: BaseTypeNode[];
  bodyDeclarations: IVisitor[];

  constructor(parent: IVisitor, node: TypeDeclaration) {
    super(parent, node, 'TypeDeclaration');

    this.modifiers = ModifierFactory.create(this, node.modifiers, ['abstract'], ['public', 'protected', 'private', 'final']);
    this.typeDeclarationName = node.interface ? 'interface ' : 'class ';
    this.name = NameFactory.create(this, node.name);
    this.typeParameters = new TypeParametersVisitor(this, node.typeParameters);

    if (node.superClassType) {
      this.superClassType = TypeFactory.create(this, node.superClassType).name;
    }

    if (node.superInterfaceTypes.length) {
      this.superInterfaceTypes = node.superInterfaceTypes.map((i) => TypeFactory.create(this, i));
    }

    if (node.bodyDeclarations.length) {
      this.bodyDeclarations = node.bodyDeclarations.map((b) => BodyDeclarationsFactory.create(this, b));
    }
  }

  visit(builder: IBuilder) {

    // indent
    builder.pad(this.indent);

    // increase padding
    this.incIndent();

    // add modifiers (public / private ...)
    builder.join(this.modifiers, '');

    // add descriptors (class / interface)
    builder.add(this.typeDeclarationName);

    // add name
    this.name.visit(builder);

    // add type parameters
    this.typeParameters.visit(builder);

    // add superclass
    if (this.superClassType) {
      builder.add(' extends ');
      builder.add(this.superClassType);
    }
    // add interfaces
    if (this.superInterfaceTypes) {
      builder.add(' implements ');
      builder.join(this.superInterfaceTypes, ', ');
    }

    // visit all children
    if (this.bodyDeclarations) {
      // we append new line after the initial bracket '{\n'
      builder.pad(this.parent.indent);
      builder.add(' {');
      builder.addLine();
      // render children
      builder.join(this.bodyDeclarations, ''); // wrap children with new lines
      builder.pad(this.parent.indent);
      builder.add('}');
      builder.addLine();
    } else {
      builder.add(' {}\n');
    }
  }
}
