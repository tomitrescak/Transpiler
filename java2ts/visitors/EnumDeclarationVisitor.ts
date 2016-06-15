import Visitor from './Visitor';
import NamesFactory from './factories/NameFactory';

import ModifiersVisitor, { ModifierLevel } from './ModifiersVisitor';

import Messages from '../config/Messages';

declare global {
  interface EnumDeclaration extends BaseTypeDeclaration {
    enumConstants: EnumConstantDeclaration[];
  }

  interface EnumConstantDeclaration extends AstElement {
    node: 'EnumConstantDeclaration';
    name: Names;
    anonymousClassDeclaration: any;
    arguments: any[];
  }
}

class EnumConstantDeclarationVisitor extends Visitor<EnumConstantDeclaration> {
  name: NameVisitor;

  constructor(parent: IVisitor, node: EnumConstantDeclaration) {
    super(parent, node, 'EnumConstantDeclaration');

    if (node.arguments.length) {
      this.addError(Messages.Errors.SimpleEnumsOnlySupported);
    }

    this.name = NamesFactory.create(this, node.name);
  }

  visit(builder: IBuilder) {
    builder.pad(this.indent);
    this.name.visit(builder);
  }
}

export class EnumDeclarationVisitor extends Visitor<EnumDeclaration> implements ITypeDeclarationVisitor {
  name: NameVisitor;
  superClassType: string = null;
  variables: any[] = null;
  methods: any[] = null;

  constructor(parent: IVisitor, node: EnumDeclaration) {
    super(parent, node, 'EnumDeclaration');

    this.name = NamesFactory.create(this, node.name);

    // validate
    if (this.node.bodyDeclarations.length) {
      this.addError(Messages.Errors.SimpleEnumsOnlySupported);
      return;
    }
  }

  findVariable(name: string): IVariableVisitor {
    return null;
  }

  findField(name: string): IVariableVisitor { return null; }
  findMethod(name: string): IMethodVisitor { return null; }
  findMethodInSuperClass(name: string): IMethodVisitor { return null; }
  findFieldInSuperClass(name: string): IVariableVisitor { return null; }

  visit(builder: IBuilder) {
    const { node } = this;
    const constants = node.enumConstants.map((c: EnumConstantDeclaration) => new EnumConstantDeclarationVisitor(this, c));
    const modifiers = new ModifiersVisitor(this, node.modifiers, [], ModifierLevel.Class);


    // pad from left
    builder.pad(this.indent);

    // increase padding for child elements
    this.incIndent();

    // add modifiers
    modifiers.visit(builder);

    // add descriptors
    builder.add('enum ');

    // add name
    this.name.visit(builder);

    // add all constants and surround them with brackets
    builder.add(' {');
    builder.addLine();
    builder.join(constants, ',\n');
    builder.addLine();
    builder.pad(this.parent.indent);
    builder.add('}');
    builder.addLine();
  }
}
