import CompilationUnitVisitor from './visitors/CompilationUnitVisitor';
import Visitor from './visitors/Visitor';
import SourceMap from './config/SourceMap';
import Handler from './config/Handler';
import Builder from './config/Builder';

const parser = require('../../imports/parser');

export function parseTree(source: string) {
  return parser.parse(source);
}

export function transpile(source: string, sourceMapIn?: SourceMap, handlerIn?: Handler): string {


  Builder.sourceMap = sourceMapIn ? sourceMapIn : new SourceMap();
  Builder.handler = handlerIn ? handlerIn : new Handler();
  Builder.text = '';
  Builder.currentLine = 0;
  Builder.currentColumn = 0;
  Builder.lineText = '';

  // init source map, reset previous run
  Builder.sourceMap.init();

  const tree = parseTree(source);
  new CompilationUnitVisitor().visit(tree);

  console.log(Builder.sourceMap);
  return Builder.text;
}
