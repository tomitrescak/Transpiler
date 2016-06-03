import Visitor from './Visitor';
import Builder from '../config/Builder';

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

  type Names = SimpleName | QualifiedName;
}

abstract class BaseNameVisitor extends Visitor {
  name: string;
}

export class SimpleNameVisitor extends BaseNameVisitor {
  visit(node: SimpleName, substitutions: string[] = null) {
    super.check(node, 'SimpleName');

    if (substitutions != null) {
      for (let i = 0; i < substitutions.length / 2; i++) {
        if (node.identifier === substitutions[i * 2]) {
          Builder.add(substitutions[i * 2 + 1], node);
          return this;
        }
      }
    }

    this.name = node.identifier;

    // build this name
    Builder.add(this.name, node);
    return this;
  }
}

export class QualifiedNameVisitor extends BaseNameVisitor {
  visit(node: QualifiedName) {
    super.check(node, 'QualifiedName');
    new NameVisitor(this).visit(node.qualifier);
    Builder.add('.');

    // remember name
    this.name = new SimpleNameVisitor(this).visit(node.name).name;
    return this;
  }
}

export default class NameVisitor extends Visitor {
  visitor: SimpleNameVisitor | QualifiedNameVisitor;

  get name() {
    return this.visitor.name;
  }

  visit(node: SimpleName | QualifiedName, substitutions: string[] = null) {

    if (node.node === 'SimpleName') {
      this.visitor = new SimpleNameVisitor(this.parent).visit(<SimpleName>node, substitutions);
    } else if (node.node === 'QualifiedName') {
      this.visitor = new QualifiedNameVisitor(this.parent).visit(<QualifiedName>node);
    } else {
      throw new Error('Unsupported node: ' + node.node);
    }
    //console.log(this.visitor);
    return this;
  }
}
