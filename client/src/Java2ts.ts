import CompilationUnitVisitor from './visitors/CompilationUnitVisitor';
import Builder from './config/Builder';

const parser = require('../../imports/parser');

export function parseTree(source: string) {
  return parser.parse(source);
}

export function transpile(source: string, handlerIn?: IHandler): IBuilder {
  const tree = parseTree(source);
  return transpileTree(tree);
}

export function transpileTree(tree: any, handlerIn?: IHandler): IBuilder {

  let builder = new Builder(handlerIn);
  let cu = new CompilationUnitVisitor(tree, builder.handler);
  cu.visit(builder);

  return builder;
}
