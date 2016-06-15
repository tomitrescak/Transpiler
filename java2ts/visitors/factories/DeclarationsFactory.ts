import { VariableDeclarationFragmentVisitor } from '../VariableDeclarationFragmentVisitor';

export default class FragmentsFactory {
  static create(parent: IVisitor, fragment: VariableDeclarationFragment, type: Types, isStatic: boolean, isFinal: boolean) {
    switch (fragment.node) {
      case 'VariableDeclarationFragment':
        return new VariableDeclarationFragmentVisitor(parent, fragment, type, isStatic, isFinal);
    }
  }

  static createArray(parent: IVisitor, fragments: VariableDeclarationFragment[], type: Types, isStatic: boolean, isFinal: boolean) {
    return fragments.map((f) => FragmentsFactory.create(parent, f, type, isStatic, isFinal));
  }
}
