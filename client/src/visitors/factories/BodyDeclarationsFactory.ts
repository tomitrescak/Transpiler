import { FieldDeclarationVisitor } from '../FieldDeclarationVisitor';

declare global {
  type BodyDeclarations = FieldDeclaration;
}

export default class BodyDeclarationsFactory {
  static create(parent: IVisitor, type: FieldDeclaration) {
    switch (type.node) {
      case 'FieldDeclaration':
        return new FieldDeclarationVisitor(parent, type);
      default:
        throw type.node + ' is not implemented';
    }
  }

  static createArray(parent: IVisitor, types: BodyDeclarations[]) {
    return types.map((t) => BodyDeclarationsFactory.create(parent, t));
  }
}
