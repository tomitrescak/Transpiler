import CompilationUnitVisitor from './visitors/CompilationUnitVisitor';
import Visitor from './visitors/Visitor';
import Builder from './config/Builder';

const parser = require('../../imports/parser');

export function parseTree(source: string) {
  return parser.parse(source);
}

export function transpile(source: string): string {
  const tree = parseTree(source);
  const cu = Builder.build(tree);
  console.log(Builder.sourceMap);
  return cu;
}
