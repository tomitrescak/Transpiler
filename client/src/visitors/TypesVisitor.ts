import Visitor from './Visitor';
import Builder from '../config/Builder';
import NameVisitor from './NameVisitor';

declare global {
  interface PrimitiveType extends AstNode {
    primitiveTypeCode: 'void' | 'byte' | 'short' | 'char' | 'int' | 'long' | 'float' | 'double' | 'boolean';
  }

  interface SimpleType extends AstNode {
      node: 'SimpleType';
      name: SimpleName | QualifiedName;
  }

  interface ParametrizedType extends AstNode {
    node: 'ParametrizedType';
    type: SimpleType | ParametrizedType;
  }

  interface ArrayType extends AstNode {
      node: 'ArrayType';
      componentType: PrimitiveType | SimpleType | ParametrizedType | ArrayType;
  }

  type Types = PrimitiveType | SimpleType | ParametrizedType | ArrayType;
}

abstract class BaseTypeVisitor extends Visitor {
  name: string;
}

export class PrimitiveTypeVisitor extends BaseTypeVisitor {
  static numbers = ['byte', 'short', 'int', 'long', 'float', 'double'];
  visit(type: PrimitiveType) {
    super.check(type, 'PrimitiveType');

    if (PrimitiveTypeVisitor.numbers.indexOf(type.primitiveTypeCode) > -1) {
      this.name = 'number';
    } else if (type.primitiveTypeCode === 'char') {
      this.name = 'string';
    } else {
      this.name = type.primitiveTypeCode;
    }

    Builder.add(this.name, type);
  }
}

export class SimpleTypeVisitor extends BaseTypeVisitor {
  visit(type: SimpleType) {
    super.check(type, 'SimpleType');

    const nameVisitor = new NameVisitor(this).visit(type.name, ['String', 'string']);
    this.name = nameVisitor.name;
  }
}

export class ParametrizedTypeVisitor extends BaseTypeVisitor {
  visit(type: ParametrizedType) {
    super.check(type, 'ParametrizedType');
  }
}

export class ArrayTypeVisitor extends BaseTypeVisitor {
  visit(type: ArrayType) {
    super.check(type, 'ArrayType');
    this.name = new TypeVisitor(this).visit(type.componentType).name;
    this.name += '[]'; // add it to the local name
    Builder.add('[]'); // add it to the builder
  }
}

export class TypesVisitor extends Visitor {
  visit(types: (SimpleType | ParametrizedType)[]) {
    types.forEach((type) => new TypeVisitor(this.parent).visit(type));
  }
}

export class TypeVisitor extends Visitor {
  typeNode: BaseTypeVisitor;
  get name() {
    return this.typeNode.name;
  }
  visit(type: SimpleType | ParametrizedType | PrimitiveType | ArrayType) {
    switch (type.node) {
      case 'PrimitiveType':
        this.typeNode = new PrimitiveTypeVisitor(this.parent);
        this.typeNode.visit(<PrimitiveType> type);
        break;
      case 'SimpleType':
        this.typeNode = new SimpleTypeVisitor(this.parent);
        this.typeNode.visit(<SimpleType> type);
        break;
      case 'ParametrizedType':
        this.typeNode = new ParametrizedTypeVisitor(this.parent);
        this.typeNode.visit(<ParametrizedType> type);
        break;
      case 'ArrayType':
        this.typeNode = new ArrayTypeVisitor(this.parent);
        this.typeNode.visit(<ArrayType> type);
        break;
      default:
        throw 'Unsupported node' + type.node;
    }
    return this;
  }
}

export default TypeVisitor;
