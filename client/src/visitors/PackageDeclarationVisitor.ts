import Visitor from './Visitor';

declare global {
  interface PackageDeclaration extends AstNode {
    annotations: MarkerAnnotation;
    name: QualifiedName | SimpleName;
    node: 'PackageDeclaration';
  }
}
