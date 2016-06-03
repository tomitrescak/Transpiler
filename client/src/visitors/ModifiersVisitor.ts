import Visitor from './Visitor';
import MarkerVisitor from './MarkerVisitor';

declare global {
  interface Modifier extends AstNode {
    node: 'Modifier';
    keyword: 'public' | 'private' | 'protected' | 'final' | 'static' | 'abstract';
  }
}

export class ModifiersVisitor extends Visitor {
  visit(nodes: (MarkerAnnotation | Modifier)[], allowedModifiers?: string[], errorModifiers?: string[], allowAnnotations = false): string {
    // we create a list of all modifiers
    let modifiers: string[] = [];
    nodes.forEach((node) => {
      switch (node.node) {
        case 'Modifier':
          modifiers.push(new ModifierVisitor(this).visit(<Modifier> node, allowedModifiers, errorModifiers));
          break;
        case 'MarkerAnnotation':
          new MarkerVisitor(this).visit(<MarkerAnnotation> node, allowAnnotations);
          break;
        default:
          Visitor.checkNode(node, ['Modifier', 'MarkerAnnotation']);
      }
    });

    // check for duplicate identifiers
    let accessors: string[] = [];
    if (modifiers.indexOf('public') > -1 ) { accessors.push('public'); }
    if (modifiers.indexOf('private') > -1 ) { accessors.push('private'); }
    if (modifiers.indexOf('protected') > -1 ) { accessors.push('protected'); }

    // filter modifiers by allowed ones
    modifiers = modifiers.filter((m) => allowedModifiers.indexOf(m) > -1);

    if (accessors.length > 1) {
      Visitor.addError(Visitor.messages.Errors.DuplicateAccessor(...accessors), nodes[0].line);
    }

    return Visitor.join(modifiers, ' ', ' ');
  }

}

export class ModifierVisitor extends Visitor {
  visit(node: Modifier, allowedModifiers: string[] = [], errorModifiers: string[] = []) {
    super.check(node, 'Modifier');

    // we only return modifier if it is allowed, otherwise we throw warning
    if (allowedModifiers.indexOf(node.keyword) === -1 && errorModifiers.indexOf(node.keyword) === -1) {
      Visitor.addWarning(Visitor.Warnigns.IgnoredModifier(node.keyword), node.line);
    }

    if (errorModifiers.indexOf(node.keyword) > -1) {
      Visitor.addError(Visitor.Errors.UnexpectedModifier(node.keyword), node.line);
      return '';
    }

    return node.keyword;
  }
}

export default ModifiersVisitor;
