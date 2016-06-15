import Visitor from './Visitor';
import NameFactory from './factories/NameFactory';

declare global {
  interface SimpleName extends AstElement {
    identifier: string;
    node: 'SimpleName';
  }

  interface QualifiedName extends AstElement {
    node: 'QualifiedName';
    name: SimpleName;
    qualifier: QualifiedName;
  }

  interface NameVisitor extends IVisitor {
    name: string;
  }

  type Names = SimpleName | QualifiedName;
}

export class SimpleNameVisitor extends Visitor<SimpleName> implements NameVisitor {
  name: string;

  constructor(parent: IVisitor, node: SimpleName) {
    super(parent, node, 'SimpleName');

    this.name = node.identifier;
  }

  get fullName() {
    return this.name;
  }

  visit(builder: IBuilder, substitutions: string[] = null) {
    let name = this.name;
    if (substitutions != null) {
      for (let i = 0; i < substitutions.length / 2; i++) {
        if (name === substitutions[i * 2]) {
          name = substitutions[i * 2 + 1];
          break;
        }
      }
    }

    // build this name
    builder.add(name, this.location);
  }
}

export class QualifiedNameVisitor extends Visitor<QualifiedName> implements NameVisitor {
  qualification: NameVisitor;
  nameNode: SimpleNameVisitor;

  constructor(parent: IVisitor, node: QualifiedName) {
    super(parent, node, 'QualifiedName');

    this.qualification = NameFactory.create(this, node.qualifier);
    this.nameNode = new SimpleNameVisitor(this, node.name);
  }

  get name() {
    return this.qualification.name + '.' + this.nameNode.name;
  }

  visit(builder: IBuilder) {
    this.qualification.visit(builder);
    builder.add('.');
    this.nameNode.visit(builder);
  }
}