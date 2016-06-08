declare global {
  interface SingleVariableDeclaration extends AstElement {
    node: 'SingleVariableDeclaration';
    type: Types;
    modifiers: Modifier[];
    varargs: boolean;
  }
}

export class SingleVariableDeclarationVisitor {

}
