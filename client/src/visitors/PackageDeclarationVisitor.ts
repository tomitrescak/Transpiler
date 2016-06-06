import Visitor from './Visitor';

declare global {
  interface PackageDeclaration extends AstElement {
    annotations: MarkerAnnotation;
    name: QualifiedName | SimpleName;
    node: 'PackageDeclaration';
  }
}
