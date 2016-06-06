import { TypeDeclarationVisitor } from '../TypeDeclarationVisitor';
import { EnumDeclarationVisitor } from '../EnumDeclarationVisitor';

export default class TypeDeclarationsFactory {
  static create(parent: IVisitor, type: TypeDeclaration | EnumDeclaration): IVisitor {
    switch (type.node) {
      case 'TypeDeclaration':
        return new TypeDeclarationVisitor(parent, <TypeDeclaration>type);
      case 'EnumDeclaration':
        return new EnumDeclarationVisitor(parent, <EnumDeclaration>type);
      default:
        throw new Error(type.node + ' is not implemented');
    }
  }

  static createArray(parent: IVisitor, types: (TypeDeclaration | EnumDeclaration)[]) {
    return types.map((t) => TypeDeclarationsFactory.create(parent, t));
  }
}
