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
  name: string;
  constructor(parent: IVisitor, node: EnumConstantDeclaration) {
    super(parent, node, 'EnumConstantDeclaration');

    if (node.arguments.length) {
      this.addError(Messages.Errors.SimpleEnumsOnlySupported);
    }

    this.name = NamesFactory.create(this, node.name).name;
  }

  visit(builder: IBuilder) {
    builder.pad(this.indent);
    builder.add(this.name);
  }
}

export class EnumDeclarationVisitor extends Visitor<EnumDeclaration> {
  constructor(parent: IVisitor, node: EnumDeclaration) {
    super(parent, node, 'EnumDeclaration');

    // validate
    if (this.node.bodyDeclarations.length) {
      this.addError(Messages.Errors.SimpleEnumsOnlySupported);
      return;
    }
  }

  visit(builder: IBuilder) {
    const { node } = this;
    const constants = node.enumConstants.map((c: EnumConstantDeclaration) => new EnumConstantDeclarationVisitor(this, c));
    const modifiers = new ModifiersVisitor(this, node.modifiers, [], ModifierLevel.Class);
    const name = NamesFactory.create(this, node.name).name;

    // pad from left
    builder.pad(this.indent);

    // increase padding for child elements
    this.incIndent();

    // add modifiers
    modifiers.visit(builder);

    // add descriptors
    builder.add('enum ');

    // add name
    builder.add(name);

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
