import Visitor from './Visitor';
import ModifiersFactory from './factories/ModifiersFactory';
import NamesFactory from './factories/NameFactory';

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
  }

  visit(builder: IBuilder) {
    // validate
    if (this.node.bodyDeclarations.length) {
      //builder.addError(builder.Errors.SimpleEnumsOnlySupported(), node.location);
      return;
    }

    const { node } = this;
    const constants = node.enumConstants.map((c: EnumConstantDeclaration) => new EnumConstantDeclarationVisitor(this, c));
    const modifiers = ModifiersFactory.create(this, node.modifiers, ['public', 'private', 'abstract'], []);
    const name = NamesFactory.create(this, node.name).name;

    // pad from left
    builder.pad(this.indent);

    // increase padding for child elements
    this.incIndent();

    // add modifiers
    builder.join(modifiers, '');

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
