import { FieldDeclarationVisitor } from '../FieldDeclarationVisitor';
import { MethodDeclarationVisitor } from '../MethodDeclarationVisitor';
import { TypeDeclarationVisitor } from '../TypeDeclarationVisitor';

declare global {
  interface IDeclarationVisitor {
    returnType: string;
  }
  type BodyDeclarations = FieldDeclaration | MethodDeclaration;
}

export default class BodyDeclarationsFactory {
  static create(parent: IVisitor, bodyType: BodyDeclarations): IVisitor {
    switch (bodyType.node) {
      case 'FieldDeclaration':
        return new FieldDeclarationVisitor(parent, bodyType as FieldDeclaration);
      case 'MethodDeclaration':
        return new MethodDeclarationVisitor(parent, bodyType as MethodDeclaration);
      case 'TypeDeclaration':
        return new TypeDeclarationVisitor(parent, bodyType as TypeDeclaration);
      default:
        throw new Error(bodyType.node + ' is not implemented');
    }
  }

  static createArray(parent: IVisitor, types: BodyDeclarations[]) {
    return types.map((t) => BodyDeclarationsFactory.create(parent, t));
  }
}
