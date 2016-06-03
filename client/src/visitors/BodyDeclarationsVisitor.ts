import Visitor from './Visitor';
import FieldDeclarationsVisitor from './FieldDeclarationVisitor';

export default class BodyDeclarationsVisitor extends Visitor {
  visit(types: (FieldDeclaration)[]): string {
    return types.map((type) => {
      switch (type.node) {
        case 'FieldDeclaration':
          return new FieldDeclarationsVisitor(this.parent).visit(type);
        default:
          throw type.node + ' is not implemented';
      }
    }).join('');
  }
}
