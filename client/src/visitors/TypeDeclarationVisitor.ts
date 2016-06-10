import { VariableHolderVisitor } from './VariableDeclarationFragmentVisitor';

import NameFactory from './factories/NameFactory';
import TypeFactory from './factories/TypeFactory';
import BodyDeclarationsFactory from './factories/BodyDeclarationsFactory';

import TypeParametersVisitor from './TypeParameterVisitor';
import ModifiersVisitor, { ModifierLevel } from './ModifiersVisitor';
import MethodDeclarationVisitor from './MethodDeclarationVisitor';
import FieldDeclarationVisitor from './FieldDeclarationVisitor';
import VariableDeclarationFragmentVisitor from './VariableDeclarationFragmentVisitor';
import {QualifiedVariableReference} from './ExpressionsVisitors';

import Messages from '../config/Messages';

declare global {
  interface ITypeDeclarationVisitor extends IVariableHolderVisitor, IMethodHolderVisitor {
    name: NameVisitor;
    superClassType: string;
    findField(name: string): IVariableVisitor;
  }

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

export class TypeDeclarationVisitor extends VariableHolderVisitor<TypeDeclaration> implements ITypeDeclarationVisitor {
  modifiers: ModifiersVisitor;
  typeDeclarationName: string;
  name: NameVisitor;
  typeParameters: TypeParametersVisitor;
  superClassType: string;
  superInterfaceTypes: TypeVisitor[];
  bodyDeclarations: IVisitor[];
  fields: FieldDeclarationVisitor[];

  methods: MethodDeclarationVisitor[];
  variables: VariableDeclarationFragmentVisitor[];


  constructor(parent: IVisitor, node: TypeDeclaration) {
    super(parent, node, 'TypeDeclaration');

    this.methods = [];
    this.fields = [];
    this.variables = [];
    this.modifiers = new ModifiersVisitor(this, node.modifiers, ['abstract'], ModifierLevel.Class);
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

  findField(name: string): IVariableVisitor {
    return this.findVariable(name);
    // if (!field) {
    //   this.addError(Messages.Errors.FieldNotFound, name);
    //   return null;
    // }
    // return field;
  }

  visit(builder: IBuilder) {

    // indent
    builder.pad(this.indent);

    // increase padding
    this.incIndent();

    // add modifiers (public / private ...)
    this.modifiers.visit(builder);

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
      builder.pad(this.indent);
      // render children
      builder.join(this.bodyDeclarations, '\n' + this.pad()); // wrap children with new lines
      builder.addLine();
      builder.pad(this.parent.indent);
      builder.add('}');
      builder.addLine();
    } else {
      builder.add(' {}\n');
    }
  }
}

export default TypeDeclarationVisitor;
