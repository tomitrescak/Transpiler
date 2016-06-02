import CompilationUnitVisitor from './visitors/CompilationUnitVisitor';

const parser = require('../../imports/parser');

export function parseTree(source: string) {
  return parser.parse(source);
}

export function transpile(source: string): string {
  const tree = parseTree(source);
  const cu = new CompilationUnitVisitor(null).visit(tree);

  return cu;
}
