import { ModifierVisitor } from '../ModifiersVisitor';
import { MarkerVisitor } from '../MarkerVisitor';
import Messages from '../../config/Messages';

export class ModifiersFactory {
  static create(parent: IVisitor, nodes: Modifiers[], allowedModifiers?: string[], ignoredModifiers?: string[], allowAnnotations = false) {
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

    return modifiers;
  }


}



export default ModifiersFactory;
