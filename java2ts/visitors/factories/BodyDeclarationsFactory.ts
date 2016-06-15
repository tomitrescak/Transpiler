import { FieldDeclarationVisitor } from '../FieldDeclarationVisitor';
import { MethodDeclarationVisitor } from '../MethodDeclarationVisitor';

declare global {
  interface IDeclarationVisitor {
    returnType: string;
  }
  type BodyDeclarations = FieldDeclaration | MethodDeclaration;
}

export default class BodyDeclarationsFactory {
  static create(parent: IVisitor, type: BodyDeclarations): IVisitor {
    switch (type.node) {
      case 'FieldDeclaration':
        return new FieldDeclarationVisitor(parent, type as FieldDeclaration);
      case 'MethodDeclaration':
        return new MethodDeclarationVisitor(parent, type as MethodDeclaration);
      default:
        throw new Error(type.node + ' is not implemented');
    }
  }

  static createArray(parent: IVisitor, types: BodyDeclarations[]) {
    return types.map((t) => BodyDeclarationsFactory.create(parent, t));
  }
}
