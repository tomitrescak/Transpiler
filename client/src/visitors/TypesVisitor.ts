import Visitor from './Visitor';
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
}

export class PrimitiveTypeVisitor extends Visitor {
  static numbers = ['byte', 'short', 'int', 'long', 'float', 'double'];
  visit(type: PrimitiveType): string {
    super.check(type, 'PrimitiveType');
    if (PrimitiveTypeVisitor.numbers.indexOf(type.primitiveTypeCode) > -1) {
      return 'number';
    } else if (type.primitiveTypeCode === 'char') {
      return 'string';
    }
    return type.primitiveTypeCode;
  }
}

export class SimpleTypeVisitor extends Visitor {
  visit(type: SimpleType): string {
    super.check(type, 'SimpleType');

    const name = new NameVisitor(this).visit(type.name);
    if (name === 'String') {
      return 'string';
    }
    return name;
  }
}

export class ParametrizedTypeVisitor extends Visitor {
  visit(type: ParametrizedType): string {
    super.check(type, 'ParametrizedType');

    return '';
  }
}

export class ArrayTypeVisitor extends Visitor {
  visit(type: ArrayType): string {
    super.check(type, 'ArrayType');
    return new TypeVisitor(this).visit(type.componentType) + '[]';
  }
}

export class TypesVisitor extends Visitor {
  visit(types: (SimpleType | ParametrizedType)[]): string {
    return types.map((type) => new TypeVisitor(this.parent).visit(type)).join();
  }
}

export class TypeVisitor extends Visitor {
  visit(type: SimpleType | ParametrizedType | PrimitiveType | ArrayType): string {
    switch (type.node) {
      case 'PrimitiveType':
        return new PrimitiveTypeVisitor(this.parent).visit(<PrimitiveType> type);
      case 'SimpleType':
        return new SimpleTypeVisitor(this.parent).visit(<SimpleType> type);
      case 'ParametrizedType':
        return new ParametrizedTypeVisitor(this.parent).visit(<ParametrizedType> type);
      case 'ArrayType':
        return new ArrayTypeVisitor(this.parent).visit(<ArrayType> type);
      default:
        throw 'Unsupported node' + type.node;
    }
  }
}

export default TypeVisitor;
