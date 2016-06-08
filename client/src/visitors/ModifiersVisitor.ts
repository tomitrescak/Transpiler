import Visitor from './Visitor';
import Messages from '../config/Messages';
import { MarkerVisitor } from './MarkerVisitor';

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

    if (allowedModifiers.length && allowedModifiers.indexOf(keyword) === -1 && ignoredModifiers.indexOf(keyword) === -1) {
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

export default class ModifiersVisitor {
  modifiers: (ModifierVisitor | MarkerVisitor)[];

  constructor(parent: IVisitor, nodes: Modifiers[], allowedModifiers?: string[], ignoredModifiers?: string[], allowAnnotations = false) {
    if (!nodes) { return };

    // we create a list of all modifiers
    let modifiers = nodes.map((node) => {
      switch (node.node) {
        case 'Modifier':
          return new ModifierVisitor(parent, <Modifier> node, allowedModifiers, ignoredModifiers);
        case 'MarkerAnnotation':
          return new MarkerVisitor(parent, <MarkerAnnotation> node, allowAnnotations);
        default:
          throw new Error(node.node + ' not implemented');
      }
    });

    // check for duplicate identifiers
    let accessors: string[] = [];
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].node === 'Modifier') {
        const n = <Modifier> nodes[i];
        if (n.keyword === 'public' || n.keyword === 'protected' || n.keyword === 'private') {
          accessors.push(n.keyword);
        }
      }
    }

    if (accessors.length > 1) {
      parent.addErrorAtLocation(nodes[0].location, Messages.Errors.DuplicateAccessor, ...accessors);
    }

    this.modifiers = modifiers;
  }

  visit(builder: IBuilder) {
    builder.join(this.modifiers, '');
  }
}
