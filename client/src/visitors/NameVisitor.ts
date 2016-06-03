import Visitor from './Visitor';

declare global {
  interface SimpleName extends AstNode {
    identifier: string;
    node: 'SimpleName';
  }

  interface QualifiedName extends AstNode {
    node: 'QualifiedName';
    name: SimpleName;
    qualifier: QualifiedName;
  }
}

export class SimpleNameVisitor extends Visitor {
  visit(node: SimpleName): string {
    super.check(node, 'SimpleName');
    return node.identifier;
  }
}

export class QualifiedNameVisitor extends Visitor {
  visit(node: QualifiedName): string {
    super.check(node, 'QualifiedName');
    return new NameVisitor(this).visit(node.qualifier) + '.' + new SimpleNameVisitor(this).visit(node.name);
  }
}

export default class NameVisitor extends Visitor {
  visit(node: SimpleName | QualifiedName): string {
    if (node.node === 'SimpleName') {
      return new SimpleNameVisitor(this.parent).visit(<SimpleName> node);
    } else if (node.node === 'QualifiedName') {
      return new QualifiedNameVisitor(this.parent).visit(<QualifiedName> node);
    }
    throw 'Unsupported node: ' + node.node;
  }
}
