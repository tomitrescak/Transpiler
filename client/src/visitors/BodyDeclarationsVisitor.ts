import Visitor from './Visitor';
import FieldDeclarationsVisitor from './FieldDeclarationVisitor';

export default class BodyDeclarationsVisitor extends Visitor {
  visit(types: (FieldDeclaration)[]) {
    types.forEach((type) => {
      switch (type.node) {
        case 'FieldDeclaration':
          return new FieldDeclarationsVisitor(this.parent).visit(type);
        default:
          throw type.node + ' is not implemented';
      }
    });
  }
}
