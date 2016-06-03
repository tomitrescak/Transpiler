import CompilationUnitVisitor from './visitors/CompilationUnitVisitor';
import Visitor from './visitors/Visitor';

const parser = require('../../imports/parser');

export function parseTree(source: string) {
  return parser.parse(source);
}

export function transpile(source: string): string {
  const tree = parseTree(source);
  const cu = new CompilationUnitVisitor(null).visit(tree);
  console.log(Visitor.sourceMap);
  return cu;
}
