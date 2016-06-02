import Visitor from './Visitor';

declare global {
  interface ImportDeclaration extends AstNode {
    name: QualifiedName;
    onDemand: boolean;
    static: boolean;
  }
}
