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
  keyword: string;

  constructor(parent: IVisitor, node: Modifier, allowedModifiers: string[] = [], ignoredModifiers: string[] = []) {
    super(parent, node, 'Modifier');
    this.keyword = node.keyword;
  }

  visit(builder: IBuilder) {
    builder.add(this.keyword + ' ', this.location);
  }
}

export enum ModifierLevel {
  Class,
  Property,
  Function,
  Parameter,
  Variable
}

export default class ModifiersVisitor {

  modifiers: ModifierVisitor[];
  markers: MarkerVisitor[];
  isStatic: boolean;
  isFinal: boolean;
  isPublic: boolean;
  isProtected: boolean;
  isPrivate: boolean;

  constructor(parent: IVisitor, nodes: Modifiers[], allowedModifiers: string[], modifierLevel: ModifierLevel, allowAnnotations = false) {
    if (!nodes) { return };

    // we create a list of all modifiers
    this.modifiers = [];
    this.markers = [];
    let accessors: string[] = [];

    nodes.forEach((node) => {
      switch (node.node) {
        case 'Modifier':
          const m = <Modifier>node;
          const visitor = new ModifierVisitor(parent, m);
          let keyword = m.keyword;

          // check whetegr it is static or final
          if (keyword === 'static') {
            this.isStatic = true;
          } else if (keyword === 'final') {
            this.isFinal = true;
          } else if (keyword === 'public' || keyword === 'protected' || keyword === 'private') {
            accessors.push(keyword);

            if (keyword === 'public') {
              this.isPublic = true;
            } else if (keyword === 'protected') {
              this.isProtected = true;
            } else if (keyword === 'private') {
              this.isPrivate = true;
            }
          }

          // we only return modifier if it is allowed, otherwise we throw warning
          if (allowedModifiers.indexOf(keyword) === -1) {
            visitor.addWarning(Messages.Warnings.IgnoredModifier, keyword);
          } else {
            // deal with final keyword based on modifier level
            // - on variable level, final becomes const, so we do not add it
            // - on method level, final becomes static but only if it is not static as well to avoid duplicates
            if (keyword === 'final') {
              if (modifierLevel === ModifierLevel.Variable) {
                return; // final is ignored as we replace it with "const" keyword
              } else {
                if (this.isStatic) {
                  return;
                } else {
                  visitor.keyword = 'static';
                }
              }
            }

            this.modifiers.push(visitor);
          }
          break;
        case 'MarkerAnnotation':
          this.markers.push(new MarkerVisitor(parent, <MarkerAnnotation>node, false));
          break;
        default:
          throw new Error(node.node + ' not implemented');
      }
    });

    // check for duplicate identifiers
    if (accessors.length > 1) {
      parent.addErrorAtLocation(nodes[0].location, Messages.Errors.DuplicateAccessor, ...accessors);
    }
  }

  visit(builder: IBuilder) {
    builder.join(this.modifiers, '');
  }
}