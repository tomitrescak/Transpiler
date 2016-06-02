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

  visit(node: CompilationUnit, sourceMapIn?: SourceMap, handlerIn?: Handler): string {
    Visitor.sourceMap = sourceMapIn ? sourceMapIn : new SourceMap();
    Visitor.handler = handlerIn ? handlerIn : new Handler();

    // init source map, reset previous run
    Visitor.sourceMap.init();

    // TODO: Handle imports
    // TODO: Handle packages

    return new TypeDeclarationsVisitor(this).visit(node.types);

  }
}
