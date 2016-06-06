import Visitor from './Visitor';

declare global {
  interface ImportDeclaration extends AstNode {
    node: 'ImportDeclaration';
    name: QualifiedName;
    onDemand: boolean;
    static: boolean;
  }
}
