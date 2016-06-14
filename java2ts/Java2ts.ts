import CompilationUnitVisitor from './visitors/CompilationUnitVisitor';
import Builder from './config/Builder';

const parser = require('../pegjs/parser');

export function parseTree(source: string) {
  return parser.parse(source);
}

export function transpileTree(tree: any, handlerIn?: IHandler): IBuilder {

  let builder = new Builder(handlerIn);
  let cu = new CompilationUnitVisitor(tree, builder.handler);
  cu.visit(builder);

  return builder;
}

export function transpile(source: string, handlerIn?: IHandler): IBuilder {
  const tree = parseTree(source);
  return transpileTree(tree);
}

export default transpile;
