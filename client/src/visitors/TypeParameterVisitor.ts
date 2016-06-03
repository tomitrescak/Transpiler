import Visitor from './Visitor';
import Builder from '../config/Builder';
import NameVisitor from './NameVisitor';
import TypeVisitor from './TypesVisitor';

declare global {
  interface TypeParameter extends AstNode {
    node: 'TypeParameter';
    name: SimpleName | QualifiedName;
    typeBounds: (SimpleType | ParametrizedType)[];
  }
}

export class TypeParameterVisitor extends Visitor {
  visit(type: TypeParameter) {
    super.check(type, 'TypeParameter');

    // draw name
    NameVisitor.visit(this, type.name);

    if (type.typeBounds.length) {
      Builder.add(' extends ');
      Builder.join(type.typeBounds, (b: Types) => TypeVisitor.visit(this, b), ' & ');
    }
    return this;
  }
}

export class TypeParametersVisitor {
  static visit(parent: Visitor, types: TypeParameter[]) {

    if (types.length) {
      Builder.add('<');
      Builder.join(types, (type: TypeParameter) => new TypeParameterVisitor(parent).visit(type),',');
      Builder.add('>');
    }
    return this;
  }
}
