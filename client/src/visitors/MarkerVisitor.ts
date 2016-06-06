import Visitor from './Visitor';

declare global {
  interface MarkerAnnotation extends AstElement {
    node: 'MarkerAnnotation';
    typeName: SimpleName | QualifiedName;
  }
}

export class MarkerVisitor extends Visitor<MarkerAnnotation> {
  allowAnnotations: boolean;

  constructor(parent: IVisitor, node: MarkerAnnotation, allowAnnotations = true) {
    super(parent, node, 'MarkerAnnotation');
    this.allowAnnotations = allowAnnotations;
  }

  visit(builder: IBuilder) {

    if (!this.allowAnnotations) {
      builder.addWarning(this.node.location, builder.Warnigns.IgnoredAnnotation);
      return '';
    }
    throw new Error('Not implemented');
  }
}

export default MarkerVisitor;
