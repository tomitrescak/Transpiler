import Visitor from './Visitor';
import NameFactory from './factories/NameFactory';
import TypeFactory from './factories/TypeFactory';

declare global {
  interface TypeParameter extends AstElement {
    node: 'TypeParameter';
    name: SimpleName | QualifiedName;
    typeBounds: (SimpleType | ParametrizedType)[];
  }
}

export class TypeParameterVisitor extends Visitor<TypeParameter> {
  name: string;
  bounds: TypeVisitor[];

  constructor(parent: IVisitor, node: TypeParameter) {
    super(parent, node, 'TypeParameter');

    this.name = NameFactory.create(this, node.name).name;
    this.bounds = node.typeBounds.map((b) => TypeFactory.create(this, b));
  }

  visit(builder: IBuilder) {

    builder.add(this.name, this.location);

    if (this.bounds.length) {
      builder.add(' extends ');
      builder.join(this.bounds, ' & ');
    }
    return this;
  }
}

export default class TypeParametersVisitor  {
  parameters: TypeParameterVisitor[];

  constructor(parent: IVisitor, node: TypeParameter[]) {
    this.parameters = node.map((p) => new TypeParameterVisitor(parent, p));
  }

  visit(builder: IBuilder) {

    if (this.parameters.length) {
      builder.add('<');
      builder.join(this.parameters, ',');
      builder.add('>');
    }
    return this;
  }
}
