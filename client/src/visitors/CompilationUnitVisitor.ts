import Visitor from './Visitor';
import TypeDeclarationsFactory from './factories/TypeDeclarationsFactory';

declare global {
  interface CompilationUnit extends AstElement {
    imports: ImportDeclaration[];
    node: 'ImportDeclaration';
    package: PackageDeclaration;
    types: TypeDeclaration[];
  }
}

export default class CompilationUnitNode extends Visitor<CompilationUnit> {
  declarations: IVisitor[];

  constructor(node: CompilationUnit, handler: IHandler) {
    super(null, node, 'CompilationUnit');

    this.handler = handler;
    this.declarations = TypeDeclarationsFactory.createArray(this, node.types);
  }

  visit(builder: IBuilder) {
    builder.join(this.declarations, '\n');
  }
}
