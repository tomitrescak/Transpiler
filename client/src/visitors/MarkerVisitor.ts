import Visitor from './Visitor';

declare global {
  interface MarkerAnnotation extends AstNode {
    node: 'MarkerAnnotation';
    typeName: SimpleName | QualifiedName;
  }
}

export default class MarkerVisitor extends Visitor {
  visit(node: MarkerAnnotation, allowAnnotations = true) {
    Visitor.checkNode(node, 'MarkerAnnotation');

    if (!allowAnnotations) {
      Visitor.addWarning(Visitor.messages.Warnings.IgnoredAnnotation(), node.line);
      return '';
    }
    throw new Error('Not implemented');
  }
}
