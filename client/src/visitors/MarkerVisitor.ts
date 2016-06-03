import Visitor from './Visitor';
import Builder from '../config/Builder';

declare global {
  interface MarkerAnnotation extends AstNode {
    node: 'MarkerAnnotation';
    typeName: SimpleName | QualifiedName;
  }
}

export default class MarkerVisitor extends Visitor {
  visit(node: MarkerAnnotation, allowAnnotations = true) {
    super.check(node, 'MarkerAnnotation');

    if (!allowAnnotations) {
      Builder.addWarning(Builder.Warnigns.IgnoredAnnotation(), node.location);
      return '';
    }
    throw new Error('Not implemented');
  }
}
