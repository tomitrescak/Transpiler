import Messages from '../config/Messages';
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

  interface UnionType extends AstElement {
    node: 'UnionType';
    types: Types[];
  }

  interface ParametrizedType extends AstElement {
    node: 'ParametrizedType';
    type: Types;
    typeArguments: Types[];
  }

  interface ArrayType extends AstElement {
    node: 'ArrayType';
    componentType: Types;
  }

  interface TypeVisitor extends Visitor<Types> {
    originalName: string;
    name: string;
  }

  type Types = PrimitiveType | SimpleType | ParametrizedType | ArrayType | UnionType;
}

export class PrimitiveTypeVisitor extends Visitor<PrimitiveType> implements TypeVisitor {
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
    builder.add(this.name, this.node.location);
  }
}

export class SimpleTypeVisitor extends Visitor<SimpleType> implements TypeVisitor {
  originalName: string;
  name: string;
  nameNode: NameVisitor;

  constructor(parent: IVisitor, node: SimpleType) {
    super(parent, node, 'SimpleType');

    this.nameNode = NameFactory.create(this, node.name);
    this.originalName = this.nameNode.name;
    this.name = this.nameNode.name;

    if (this.name === 'string') {
      this.addError(Messages.Errors.SymbolNotFound, 'string');
    }
  }

  visit(builder: IBuilder) {
    this.nameNode.visit(builder, ['String', 'string']);
  }
}

export class ParametrizedTypeVisitor extends Visitor<ParametrizedType> implements TypeVisitor {
  name: string;
  originalName: string;
  type: TypeVisitor;
  typeArguments: TypeVisitor[];

  constructor(parent: IVisitor, node: ParametrizedType) {
    super(parent, node, 'ParameterizedType');

    this.type = TypeFactory.create(this, node.type);
    this.typeArguments = TypeFactory.createArray(this, node.typeArguments);

    this.originalName = this.type.originalName;
    this.name = this.type.name;
  }

  visit(builder: IBuilder) {
    this.type.visit(builder);
    builder.add('<');
    builder.join(this.typeArguments, ',');
    builder.add('>');
  }
}

export class ArrayTypeVisitor extends Visitor<ArrayType> implements TypeVisitor {
  name: string;
  originalName: string;
  nameNode: NameVisitor;

  constructor(parent: IVisitor, node: ArrayType) {
    super(parent, node, 'ArrayType');

    this.nameNode = TypeFactory.create(this, node.componentType);
    this.name = this.nameNode.name;
    this.originalName = this.name;
    this.name += '[]'; // add it to the local name
  }

  visit(builder: IBuilder) {
    this.nameNode.visit(builder);
    builder.add('[]');
  }
}

export class UnionTypeVisitor extends Visitor<UnionType> implements TypeVisitor {
  name: string;
  originalName: string;
  types: TypeVisitor[];

  constructor(parent: IVisitor, node: UnionType) {
    super(parent, node, 'UnionType');

    this.types = TypeFactory.createArray(this, node.types);

    this.name = this.types.map((t) => t.originalName).join('|');
    this.originalName = this.name;
  }

  visit(builder: IBuilder) {
    builder.join(this.types, '|');
  }
}

export class TypesVisitor {
  static visit(parent: IVisitor, types: (SimpleType | ParametrizedType)[]): TypeVisitor[] {
    return types.map((type) => TypeFactory.create(parent, type));
  }
}
