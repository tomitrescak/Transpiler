import * as ts from 'typescript';
import CompositeCompilerHost from './compositeCompilerHost';
import { SourceType, CompilerOptions, CompilationResult, FileSource, IResultWriterFn, Source, StringSource } from './types';

function formatError(diagnostic: ts.Diagnostic) {
  let output = '';
  if (diagnostic.file) {
    let loc = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    output += diagnostic.file.fileName + '(' + loc.line + ',' + loc.character + '): ';
  }
  let category = ts.DiagnosticCategory[diagnostic.category].toLowerCase();
  output += category + ' TS' + diagnostic.code + ': ' + diagnostic.messageText + ts.sys.newLine;
  return output;
}

function forwardErrors(errors: any, onError: any) {
  if (typeof onError === 'function') {
    errors.forEach((e: any) => {
      e.formattedMessage = formatError(e);
      onError(e);
    });
  }
}

function _compile(host: CompositeCompilerHost, sources: Source[], tscArgs: string, options?: CompilerOptions, onError?: (message: any) => void): CompilationResult
function _compile(host: CompositeCompilerHost, sources: Source[], tscArgs: string[], options?: CompilerOptions, onError?: (message: any) => void): CompilationResult
function _compile(host: CompositeCompilerHost, sources: Source[], tscArgs?: any, options?: CompilerOptions, onError?: (message: any) => void): CompilationResult {

  if (typeof tscArgs === 'string') {
    tscArgs = tscArgs.split(' ');
  } else {
    tscArgs = tscArgs || [];
  }

  let commandLine = ts.parseCommandLine(tscArgs);
  let files: any[];

  if (host.readsFrom === SourceType.String) {
    sources.forEach(s => host.addSource(s.filename, s.contents));
    files = host.getSourcesFilenames();
  } else {
    files = ts.map(sources, s => s.filename).concat(commandLine.fileNames);
  }

  let program = ts.createProgram(files, commandLine.options, host);

  // Query for early errors
  let errors = program.getSyntacticDiagnostics();
  // todo: make async
  forwardErrors(errors, onError);

  let emitResult: any;

  // Do not generate code in the presence of early errors
  if (!errors.length) {
    // Type check and get semanic errors
    let checker = program.getTypeChecker();
    let semanticErrors = program.getSemanticDiagnostics();
    // todo: make async
    forwardErrors(semanticErrors, onError);

    // checker.getDiagnostics(); // TODO: Check

    // Generate output
    emitResult = program.emit();
    // todo: make async
    forwardErrors(emitResult.diagnostics, onError);

    errors = ts.concatenate(semanticErrors, emitResult.diagnostics);
  }

  return {
    sources: host.outputs,
    sourceMaps: emitResult && emitResult.sourceMaps ? emitResult.sourceMaps : [],
    errors: ts.map<any, string>(errors, e => {
      return formatError(e)
    })
  };
}

export function compileWithHost(host: CompositeCompilerHost, sources: Source[], tscArgs: ts.ParsedCommandLine, options?: CompilerOptions, onError?: (message: any) => void): any
export function compileWithHost(host: CompositeCompilerHost, sources: Source[], tscArgs: string[], options?: CompilerOptions, onError?: (message: any) => void): any
export function compileWithHost(host: CompositeCompilerHost, sources: Source[], tscArgs: any, options?: CompilerOptions, onError?: (message: any) => void): any {
  return _compile(host, sources, tscArgs, options, onError);
}

export function compile(files: string, tscArgs?: string, options?: CompilerOptions, onError?: (message: any) => void): CompilationResult
export function compile(files: string, tscArgs?: string[], options?: CompilerOptions, onError?: (message: any) => void): CompilationResult
export function compile(files: string[], tscArgs?: string, options?: CompilerOptions, onError?: (message: any) => void): CompilationResult
export function compile(files: string[], tscArgs?: string[], options?: CompilerOptions, onError?: (message: any) => void): CompilationResult
export function compile(files: any, tscArgs?: any, options?: any, onError?: (message: any) => void): CompilationResult {

  if (typeof files === 'string') {
    files = [files];
  }

  return _compile(new CompositeCompilerHost(options),
    ts.map(<string[]>files, (f) => new FileSource(f)),
    tscArgs, options, onError);
}

export function compileStrings(input: ts.Map<string>, tscArgs?: string, options?: CompilerOptions, onError?: (message: any) => void): CompilationResult
export function compileStrings(input: ts.Map<string>, tscArgs?: string[], options?: CompilerOptions, onError?: (message: any) => void): CompilationResult
export function compileStrings(input: StringSource[], tscArgs?: string, options?: CompilerOptions, onError?: (message: any) => void): CompilationResult
export function compileStrings(input: StringSource[], tscArgs?: string[], options?: CompilerOptions, onError?: (message: any) => void): CompilationResult
export function compileStrings(input: string[], tscArgs?: string, options?: CompilerOptions, onError?: (message: any) => void): CompilationResult
export function compileStrings(input: string[], tscArgs?: string[], options?: CompilerOptions, onError?: (message: any) => void): CompilationResult
export function compileStrings(input: any, tscArgs?: any, options?: CompilerOptions, onError?: (message: any) => void): CompilationResult {

  let host = new CompositeCompilerHost(options)
    .readFromStrings()
    .writeToString();

  let sources: any[] = [];

  if (Array.isArray(input) && input.length) {
    // string[]
    if (typeof input[0] === 'string') {
      sources = ts.map<string, StringSource>(input, s => new StringSource(s));
    } else if (input[0] instanceof StringSource) {
      sources.concat(input);
    } else {
      throw new Error('Invalid value for input argument');
    }
  } else if (typeof input === 'object') {
    // dictionary
    for (let k in input) {
      if (input.hasOwnProperty(k)) {
        sources.push(new StringSource(input[k], k));
      }
    }
  } else {
    throw new Error('Invalid value for input argument');
  }

  return _compile(host, sources, tscArgs, options, onError);
}

export function compileString(input: StringSource, tscArgs?: string, options?: CompilerOptions, onError?: (message: any) => void): string
export function compileString(input: StringSource, tscArgs?: string[], options?: CompilerOptions, onError?: (message: any) => void): string
export function compileString(input: string, tscArgs?: string, options?: CompilerOptions, onError?: (message: any) => void): string
export function compileString(input: string, tscArgs?: string, options?: CompilerOptions, onError?: (message: any) => void): string
export function compileString(input: any, tscArgs?: any, options?: CompilerOptions, onError?: (message: any) => void): string {
  if (typeof input !== 'string' && !(input instanceof StringSource)) {
    throw new Error('typescript-compiler#compileString: input parameter should be either a string or a StringSource object');
  }

  if (input === '') { return ''; };

  let result = '';

  let host = new CompositeCompilerHost(options)
    .readFromStrings()
    .writeToString()
    .redirectOutput((filename, data) => result += data);

  _compile(host, [input instanceof StringSource ? input : new StringSource(input, 'string.ts')], tscArgs, options, onError);

  return result;
}
