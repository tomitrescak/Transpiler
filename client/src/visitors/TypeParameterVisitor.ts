import Visitor from './Visitor';
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
  visit(type: TypeParameter): string {
    Visitor.checkNode(type, 'TypeParameter');

    let bounds = '';
    if (type.typeBounds.length) {
      bounds = Visitor.join(type.typeBounds.map((b) => new TypeVisitor(this).visit(b)), ' & ');
      bounds = ' extends ' + bounds;
    }

    return `${new NameVisitor(this).visit(type.name)}${bounds}`;
  }
}

export class TypeParametersVisitor extends Visitor {
  visit(types: TypeParameter[]): string {
    if (!types.length) {
      return '';
    }
    return '<' + types.map((type) => new TypeParameterVisitor(this.parent).visit(type)).join() + '>';
  }
}
