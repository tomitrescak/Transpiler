import transpile from '../java2ts/Java2ts';
import { compileStrings } from '../ts2js/index';
import { StringSource } from '../ts2js/types';

interface IFile {
  name: string;
  source: string;
}

// re export custom functiond
export { transpile, parseTree } from '../java2ts/Java2ts';
export { compile, compileString, compileStrings } from '../ts2js/index';

export function java2js(files: IFile[]): CompilationResult {
  // transpile to ts

  let tss = files.map((f) => {
    return {
      name: f.name,
      builder: transpile(f.source)
    };
  });

  // detect all errors

  let errors = 0;
  let messages: CompilationError[] = [];

  tss.forEach((t) => {
    t.builder.handler.warnings.forEach((w) => {
      messages.push({
        file: t.name,
        line: w.line,
        column: w.column,
        message: w.message,
        category: 'warning'
      });
    });

    t.builder.handler.errors.forEach((w) => {
      errors ++;
      messages.push({
        file: t.name,
        line: w.line,
        column: w.column,
        message: w.message,
        category: 'error'
      });
    });
  });

  // in case there was an error during transpilation
  if (errors > 0) {
    return {
      sources: null,
      errors: messages
    };
  }
}
