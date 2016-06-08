import { PrimitiveTypeVisitor, SimpleTypeVisitor, ParametrizedTypeVisitor, ArrayTypeVisitor } from '../TypesVisitor';

export class TypeFactory {
  static create(parent: IVisitor, type: SimpleType | ParametrizedType | PrimitiveType | ArrayType): BaseTypeNode {
    // console.log(type)
    switch (type.node) {
      case 'PrimitiveType':
        return new PrimitiveTypeVisitor(parent, <PrimitiveType>type);
      case 'SimpleType':
        return new SimpleTypeVisitor(parent, <SimpleType>type);
      case 'ParametrizedType':
        return new ParametrizedTypeVisitor(parent, <ParametrizedType>type);
      case 'ArrayType':
        return new ArrayTypeVisitor(parent, <ArrayType>type);
      default:
        throw new Error('Unsupported node' + type.node);
    }
  }
}

export default TypeFactory;
