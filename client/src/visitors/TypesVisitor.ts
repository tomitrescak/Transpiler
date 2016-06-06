import Visitor from './Visitor';
import NameFactory from './factories/NameFactory';
import TypeFactory from './factories/TypeFactory';

declare global {
  interface PrimitiveType extends AstElement {
    primitiveTypeCode: 'void' | 'byte' | 'short' | 'char' | 'int' | 'long' | 'float' | 'double' | 'boolean';
  }

  interface SimpleType extends AstElement {
    node: 'SimpleType';
    name: SimpleName | QualifiedName;
  }

  interface ParametrizedType extends AstElement {
    node: 'ParametrizedType';
    type: SimpleType | ParametrizedType;
  }

  interface ArrayType extends AstElement {
    node: 'ArrayType';
    componentType: PrimitiveType | SimpleType | ParametrizedType | ArrayType;
  }

  interface BaseTypeNode extends Visitor<Types> {
    name: string;
  }

  type Types = PrimitiveType | SimpleType | ParametrizedType | ArrayType;
}



export class PrimitiveTypeVisitor extends Visitor<PrimitiveType> implements BaseTypeNode {
  static numbers = ['byte', 'short', 'int', 'long', 'float', 'double'];
  name: string;

  constructor(parent: IVisitor, node: PrimitiveType) {
    super(parent, node, 'PrimitiveType');

    if (PrimitiveTypeVisitor.numbers.indexOf(node.primitiveTypeCode) > -1) {
      this.name = 'number';
    } else if (node.primitiveTypeCode === 'char') {
      this.name = 'string';
    } else {
      this.name = node.primitiveTypeCode;
    }
  }

  visit(builder: IBuilder) {
    builder.add(this.name, this.node.location);
  }
}

export class SimpleTypeVisitor extends Visitor<SimpleType> implements BaseTypeNode {
  name: string;

  constructor(parent: IVisitor, node: SimpleType) {
    super(parent, node, 'SimpleType');

    this.name = NameFactory.create(this, node.name, ['String', 'string']).name;
  }

  visit(builder: IBuilder) {
    builder.add(this.name, this.location);
  }
}

export class ParametrizedTypeVisitor extends Visitor<ParametrizedType> implements BaseTypeNode {
  name: string;

  constructor(parent: IVisitor, node: ParametrizedType) {
    super(parent, node, 'ParametrizedType');

    throw new Error('Not Implemented');
  }

  visit(builder: IBuilder) {
    throw new Error('Not Implemented');
  }
}

export class ArrayTypeVisitor extends Visitor<ArrayType> implements BaseTypeNode {
  name: string;

  constructor(parent: IVisitor, node: ArrayType) {
    super(parent, node, 'ArrayType');

    this.name = TypeFactory.create(this, node.componentType).name;
    this.name += '[]'; // add it to the local name
  }

  visit(builder: IBuilder) {
    builder.add(this.name);
  }
}

export class TypesVisitor {
  static visit(parent: IVisitor, types: (SimpleType | ParametrizedType)[]): BaseTypeNode[] {
    return types.map((type) => TypeFactory.create(parent, type));
  }
}
