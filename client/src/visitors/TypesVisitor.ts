import Messages from "../config/Messages";
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
    originalName: string;
    name: string;
  }

  type Types = PrimitiveType | SimpleType | ParametrizedType | ArrayType;
}

export class PrimitiveTypeVisitor extends Visitor<PrimitiveType> implements BaseTypeNode {
  static numbers = ['byte', 'short', 'int', 'long', 'float', 'double'];
  originalName: string;
  name: string;

  constructor(parent: IVisitor, node: PrimitiveType) {
    super(parent, node, 'PrimitiveType');

    this.originalName = node.primitiveTypeCode;

    if (PrimitiveTypeVisitor.numbers.indexOf(node.primitiveTypeCode) > -1) {
      this.name = 'number';
    } else if (node.primitiveTypeCode === 'char') {
      this.name = 'string';
    } else {
      this.name = node.primitiveTypeCode;
    }
  }

  visit(builder: IBuilder) {
    builder.add(this.name, this.node.location)
  }
}

export class SimpleTypeVisitor extends Visitor<SimpleType> implements BaseTypeNode {
  originalName: string;
  name: string;
  nameNode: NameVisitor;

  constructor(parent: IVisitor, node: SimpleType) {
    super(parent, node, 'SimpleType');

    this.nameNode = NameFactory.create(this, node.name);
    this.originalName = this.nameNode.name;
    this.name = this.nameNode.name;

    if (this.name === 'string') {
      this.addError(Messages.Errors.CannotFindSymbol, 'string');
    }
  }

  visit(builder: IBuilder) {
    this.nameNode.visit(builder, ['String', 'string']);
  }
}

export class ParametrizedTypeVisitor extends Visitor<ParametrizedType> implements BaseTypeNode {
  name: string;
  originalName: string;

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
  originalName: string;

  constructor(parent: IVisitor, node: ArrayType) {
    super(parent, node, 'ArrayType');

    this.name = TypeFactory.create(this, node.componentType).name;
    this.originalName = this.name;
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
