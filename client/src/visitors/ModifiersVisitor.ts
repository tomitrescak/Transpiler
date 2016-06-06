import Visitor from './Visitor';
import Messages from '../config/Messages';

declare global {
  interface Modifier extends AstElement {
    node: 'Modifier';
    keyword: 'public' | 'private' | 'protected' | 'final' | 'static' | 'abstract';
  }

  type Modifiers = (Modifier | MarkerAnnotation);
}

export class ModifierVisitor extends Visitor<Modifier> {
  modifier: string;
  render: boolean;

  constructor(parent: IVisitor, node: Modifier, allowedModifiers: string[] = [], ignoredModifiers: string[] = []) {
    super(parent, node, 'Modifier');

    const {keyword} = node;

    this.modifier = keyword;
    this.render = true;

    // we only return modifier if it is allowed, otherwise we throw warning
    if (allowedModifiers.indexOf(keyword) === -1 && ignoredModifiers.indexOf(keyword) > -1) {
      this.addWarning(Messages.Warnings.IgnoredModifier, keyword);
      this.render = false;
    }

    if (allowedModifiers.indexOf(keyword) === -1 && ignoredModifiers.indexOf(keyword) === -1) {
      this.addError(Messages.Errors.UnexpectedModifier, keyword);
      this.render = false;
    }
  }

  visit(builder: IBuilder) {
    const { location, keyword } = this.node;

    if (this.render) {
      builder.add(keyword + ' ', location);
    }
  }
}
