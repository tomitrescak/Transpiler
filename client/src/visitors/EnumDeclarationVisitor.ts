import Visitor from './Visitor';
import Builder from '../config/Builder';
import ModifiersVisitor from './ModifiersVisitor';
import NamesVisitor from './NameVisitor';

declare global {
  interface EnumDeclaration extends BaseTypeDeclaration {
    enumConstants: EnumConstantDeclaration[];
  }

  interface EnumConstantDeclaration extends AstNode {
    node: 'EnumConstantDeclaration';
    name: Names;
    anonymousClassDeclaration: any;
    arguments: any[];
  }
}

class EnumConstantDeclarationVisitor extends Visitor {
  visit (node: EnumConstantDeclaration) {
    Builder.pad(this.indent);
    NamesVisitor.visit(this, node.name);
  }
}

class EnumConstantDeclarationsVisitor {
    static visit(parent: Visitor, nodes: EnumConstantDeclaration[]) {
      Builder.join(nodes, (node: EnumConstantDeclaration) => new EnumConstantDeclarationVisitor(parent).visit(node), ',\n');
    }
}

export default class EnumDeclarationVisitor extends Visitor {
  visit(node: EnumDeclaration) {
    // validate
    if (node.bodyDeclarations.length) {
      //Builder.addError(Builder.Errors.SimpleEnumsOnlySupported(), node.location);
      return;
    }

    // pad from left
    Builder.pad(this.indent);

    // increase padding for child elements
    this.incIndent();

    // add modifiers
    ModifiersVisitor.visit(this, node.modifiers, ['public', 'private', 'abstract'], []);

    // add descriptors
    Builder.add('enum ');

    // add name
    NamesVisitor.visit(this, node.name);

    // add all constants and surround them with brackets
    Builder.add(' {');
    Builder.addLine();
    EnumConstantDeclarationsVisitor.visit(this, node.enumConstants);
    Builder.addLine();
    Builder.pad(this.parent.indent);
    Builder.add('}');
    Builder.addLine();
  }
}
