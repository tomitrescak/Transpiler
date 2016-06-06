import { FragmentVisitor } from '../FieldDeclarationVisitor';

export default class FragmentsFactory {
  static create(parent: IVisitor, fragment: VariableDeclarationFragment, type: Types) {
    switch (fragment.node) {
      case 'VariableDeclarationFragment':
        return new FragmentVisitor(parent, fragment, type);
    }
  }

  static createArray(parent: IVisitor, fragments: VariableDeclarationFragment[], type: Types) {
    return fragments.map((f) => FragmentsFactory.create(parent, f, type));
  }
}
