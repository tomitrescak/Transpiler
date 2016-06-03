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
  visit(type: PrimitiveType): BaseTypeVisitor {
    super.check(type, 'PrimitiveType');

    if (PrimitiveTypeVisitor.numbers.indexOf(type.primitiveTypeCode) > -1) {
      this.name = 'number';
    } else if (type.primitiveTypeCode === 'char') {
      this.name = 'string';
    } else {
      this.name = type.primitiveTypeCode;
    }

    Builder.add(this.name, type);
    return this;
  }
}

export class SimpleTypeVisitor extends BaseTypeVisitor {
  visit(type: SimpleType): BaseTypeVisitor {
    super.check(type, 'SimpleType');

    const nameVisitor = NameVisitor.visit(this, type.name, ['String', 'string']);
    this.name = nameVisitor.name;
    return this;
  }
}

export class ParametrizedTypeVisitor extends BaseTypeVisitor {
  visit(type: ParametrizedType) {
    super.check(type, 'ParametrizedType');
    return this;
  }
}

export class ArrayTypeVisitor extends BaseTypeVisitor {
  visit(type: ArrayType): BaseTypeVisitor {
    super.check(type, 'ArrayType');
    this.name = TypeVisitor.visit(this, type.componentType).name;
    this.name += '[]'; // add it to the local name
    Builder.add('[]'); // add it to the builder
    return this;
  }
}

export class TypesVisitor {
  static visit(parent: Visitor, types: (SimpleType | ParametrizedType)[]) {
    types.forEach((type) => TypeVisitor.visit(parent, type));
  }
}

export class TypeVisitor {
  static visit(parent: Visitor, type: SimpleType | ParametrizedType | PrimitiveType | ArrayType): BaseTypeVisitor {
    console.log(type)
    switch (type.node) {
      case 'PrimitiveType':
        return new PrimitiveTypeVisitor(parent).visit(<PrimitiveType> type);
      case 'SimpleType':
        return new SimpleTypeVisitor(parent).visit(<SimpleType> type);
      case 'ParametrizedType':
        return new ParametrizedTypeVisitor(parent).visit(<ParametrizedType> type);
      case 'ArrayType':
        return new ArrayTypeVisitor(parent).visit(<ArrayType> type);
      default:
        throw 'Unsupported node' + type.node;
    }
  }
}

export default TypeVisitor;
