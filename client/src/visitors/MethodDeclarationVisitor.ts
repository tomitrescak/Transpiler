import Visitor from './Visitor';

declare global {
  interface Block {
    node: 'Block';
    statements: IVisitor[];
  }

  interface MethodDeclaration extends AstElement {
    node: 'MethodDeclaration';
    typeParameters: TypeParameter[];
    name: SimpleName;
    returnType2: Types;
    constructor: boolean;
    body: Block;
    thrownExceptions: Names[];
  }
}

export class MethodDeclarationVisitor extends Visitor<MethodDeclaration> {
  name: NameVisitor;
  returnType: TypeVisitor;
  
  constructor(parent: IVisitor, node: MethodDeclaration) {
    super(parent, node, 'MethodDeclaration');
  }

  visit (builder: IBuilder) {

  }
}
