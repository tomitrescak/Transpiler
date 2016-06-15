import Visitor from './Visitor';
import Messages from '../config/Messages';

declare global {
  interface MarkerAnnotation extends AstElement {
    node: 'MarkerAnnotation';
    typeName: SimpleName | QualifiedName;
  }
}

export class MarkerVisitor extends Visitor<MarkerAnnotation> {
  allowAnnotations: boolean;

  constructor(parent: IVisitor, node: MarkerAnnotation, allowAnnotations = false) {
    super(parent, node, 'MarkerAnnotation');
    this.allowAnnotations = allowAnnotations;

    if (!this.allowAnnotations) {
      this.addWarning(Messages.Warnings.IgnoredAnnotation);
    }
  }

  visit(builder: IBuilder) {
    console.log(this.allowAnnotations + ' e')
    if (!this.allowAnnotations) {
      this.addWarning(builder.Warnigns.IgnoredAnnotation);
      return '';
    }
    throw new Error('Not implemented');
  }
}

export default MarkerVisitor;
