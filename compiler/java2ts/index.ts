import CompilationUnitVisitor from './visitors/CompilationUnitVisitor';
import CompilationBundleVisitor from './visitors/CompilationBundleVisitor';

// transpilation service

interface ICompilationFile {
  name: string;
  source: string;
}

let bundle: CompilationBundleVisitor = null;


export function serviceCompile(file: ICompilationFile, parseOnly = false): ICompilationResult {
  return bundle.compile(file, parseOnly);
}

export function initService(files: ICompilationFile[]): ICompilationResult {
  bundle = new CompilationBundleVisitor();

  let compilationResult: ICompilationResult = {
    errors: [],
    warnings: [],
    files: {}
  };

  // pre-parse all files
  files.forEach((f) => {
    bundle.compile(f, true);
  });

  // compile all files
  files.forEach((f) => {
    const res = bundle.compile(f);
    compilationResult.files = res.files;
    compilationResult.errors = compilationResult.errors.concat(res.errors);
    compilationResult.warnings = compilationResult.warnings.concat(res.warnings);
  });

  return compilationResult;
}

// helpers

import Builder from './config/Builder';

const parser = require('../pegjs/parser');

export function parseTree(source: string) {
  return parser.parse(source);
}

export function transpileTree(tree: any, bundle?: ICompilationBundleVisitor, handlerIn?: IHandler): IBuilder {

  let builder = new Builder(handlerIn);
  let cu = new CompilationUnitVisitor(bundle, tree, builder.handler);
  cu.visit(builder);

  return builder;
}

export function transpile(source: string, handlerIn?: IHandler): IBuilder {
  const tree = parseTree(source);
  return transpileTree(tree);
}

export default transpile;
