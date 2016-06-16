import Visitor from './Visitor';

declare global {
  interface ImportDeclaration extends AstElement {
    node: 'ImportDeclaration';
    name: QualifiedName;
    onDemand: boolean;
    static: boolean;
  }
}
