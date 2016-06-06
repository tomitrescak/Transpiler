import Visitor from './Visitor';
import SourceMap from '../config/SourceMap';
import Handler from '../config/Handler';
import { TypeDeclarationsVisitor } from './TypeDeclarationVisitor';

declare global {
  interface CompilationUnit extends AstNode {
    imports: ImportDeclaration[];
    node: 'ImportDeclaration';
    package: PackageDeclaration;
    types: TypeDeclaration[];
  }
}

export default class CompilationUnitVisitor extends Visitor {

  constructor() {
    super(null);
  }

  visit(node: CompilationUnit) {
    // TODO: Handle imports
    // TODO: Handle packages
    TypeDeclarationsVisitor.visit(this, node.types);

  }
}
