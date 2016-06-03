import Visitor from './Visitor';
import Builder from '../config/Builder';
import MarkerVisitor from './MarkerVisitor';

declare global {
  interface Modifier extends AstNode {
    node: 'Modifier';
    keyword: 'public' | 'private' | 'protected' | 'final' | 'static' | 'abstract';
  }
}

export class ModifiersVisitor {
  static visit(parent: Visitor, nodes: (MarkerAnnotation | Modifier)[], allowedModifiers?: string[], errorModifiers?: string[], allowAnnotations = false) {
    if (!nodes) { return };

    // we create a list of all modifiers
    nodes.forEach((node) => {
      switch (node.node) {
        case 'Modifier':
          new ModifierVisitor(parent).visit(<Modifier>node, allowedModifiers, errorModifiers);
          break;
        case 'MarkerAnnotation':
          new MarkerVisitor(parent).visit(<MarkerAnnotation>node, allowAnnotations);
          break;
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
      Builder.addError(Builder.Errors.DuplicateAccessor(...accessors), nodes[0].location);
    }
  }

}

export class ModifierVisitor extends Visitor {
  visit(node: Modifier, allowedModifiers: string[] = [], errorModifiers: string[] = []) {
    super.check(node, 'Modifier');

    // we only return modifier if it is allowed, otherwise we throw warning
    if (allowedModifiers.indexOf(node.keyword) === -1 && errorModifiers.indexOf(node.keyword) === -1) {
      Builder.addWarning(Builder.Warnigns.IgnoredModifier(node.keyword), node.location);
      return;
    }

    if (errorModifiers.indexOf(node.keyword) > -1) {
      Builder.addError(Builder.Errors.UnexpectedModifier(node.keyword), node.location);
      return '';
    }

    Builder.add(node.keyword + ' ', node);
  }
}

export default ModifiersVisitor;
