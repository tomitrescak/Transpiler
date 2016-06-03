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
    new NameVisitor(this).visit(type.name);

    if (type.typeBounds.length) {
      Builder.add(' extends ');
      Builder.join(type.typeBounds, (b: Types) => new TypeVisitor(this).visit(b), ' & ');
    }
    return this;
  }
}

export class TypeParametersVisitor extends Visitor {
  visit(types: TypeParameter[]) {

    if (types.length) {
      Builder.add('<');
      Builder.join(types, (type: TypeParameter) => new TypeParameterVisitor(this.parent).visit(type),',');
      Builder.add('>');
    }
    return this;
  }
}
