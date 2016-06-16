import Visitor from './Visitor';
import TypeDeclarationsFactory from './factories/TypeDeclarationsFactory';

declare global {
  interface ICompilationUnitVisitor extends IVisitor {
    declarations: ITypeDeclarationVisitor[];
    findDeclaration(name: string): ITypeDeclarationVisitor;
  }

  interface CompilationUnit extends AstElement {
    imports: ImportDeclaration[];
    node: 'ImportDeclaration';
    package: PackageDeclaration;
    types: TypeDeclaration[];
  }
}

export default class CompilationUnitNode extends Visitor<CompilationUnit> {
  declarations: ITypeDeclarationVisitor[];

  constructor(parent: IVisitor, node: CompilationUnit, handler: IHandler) {
    super(parent, node, 'CompilationUnit');

    this.handler = handler;
    this.declarations = TypeDeclarationsFactory.createArray(this, node.types);
  }

  visit(builder: IBuilder) {
    builder.join(this.declarations, '\n');
  }

  findDeclaration(name: string): ITypeDeclarationVisitor {
    return this.declarations.find((d) => d.name.name === name)
  }
}
