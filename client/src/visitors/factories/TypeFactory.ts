import { PrimitiveTypeVisitor, SimpleTypeVisitor, ParametrizedTypeVisitor, ArrayTypeVisitor } from '../TypesVisitor';

export class TypeFactory {
  static create(parent: IVisitor, type: Types): TypeVisitor {
    switch (type.node) {
      case 'PrimitiveType':
        return new PrimitiveTypeVisitor(parent, <PrimitiveType>type);
      case 'SimpleType':
        return new SimpleTypeVisitor(parent, <SimpleType>type);
      case 'ParameterizedType':
        return new ParametrizedTypeVisitor(parent, <ParametrizedType>type);
      case 'ArrayType':
        return new ArrayTypeVisitor(parent, <ArrayType>type);
      default:
        throw new Error('Unsupported node ' + type.node);
    }
  }

  static createArray(parent: IVisitor, types: Types[]) {
    return types.map((t) => TypeFactory.create(parent, t));
  }
}

export default TypeFactory;
