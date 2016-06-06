import { SimpleNameVisitor, QualifiedNameVisitor } from '../NameVisitor';

export default class NameFactory {
  static create(parent: IVisitor, node: Names, substitutions: string[] = null): NameVisitor {
    if (node.node === 'SimpleName') {
      return new SimpleNameVisitor(parent, <SimpleName>node, substitutions);
    } else if (node.node === 'QualifiedName') {
      return new QualifiedNameVisitor(parent, <QualifiedName>node);
    } else {
      throw new Error('Unsupported node: ' + node.node);
    }
  }
}
