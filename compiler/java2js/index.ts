import { initService as initj2ts, serviceCompile as compilej2ts } from '../java2ts/index';
import { initService as initts2js, serviceCompile as compilets2js  } from '../ts2js/index';

interface IFile {
  name: string;
  source: string;
}

export function initService(files: IFile[] = []) {
  let result = initj2ts(files);

  // copy to array
  let compiledFiles: IFile[] = [];
  for (let f in result.files) {
    let rf = result.files[f];
    compiledFiles.push({ name: rf.name.replace('.java', '.ts'), source: rf.result } );
  }
  initts2js(compiledFiles);
}

interface IDoubleCompilationResult {
  ts?: Map<ICompiledFile>;
  js?: Map<ICompiledFile>;
  errors: IMessage[];
  warnings: IMessage[];
}

interface IAsyncCompilationResult {
  files: Map<ICompiledFile>;
  ts: Map<ICompiledFile>;
  warnings: Map<IMessage[]>;
  errors: Map<IMessage[]>;
}

function compileWithCallback(files: IFile[], cb: Function) {
  let result: IAsyncCompilationResult = {
    files: {},
    ts: {},
    errors: null,
    warnings: null
  };

  for (let file of files) {
    let compilation = compile(file);
    result.files = compilation.js;
    result.ts = compilation.ts;

    // copy errors
    if (compilation.errors && compilation.errors.length) {
      if (!result.errors) {
        result.errors = {};
      }
      result.errors[file.name] = compilation.errors;
    }

    // copy warnings
    if (compilation.warnings && compilation.warnings.length) {
      if (!result.warnings) {
        result.warnings = {};
      }
      result.warnings[file.name] = compilation.warnings;
    }
  }

  // call back result
  cb(result);
}

let tout: number = null;
export function compileAsync(files: IFile[], cb: Function, timeout = 500) {
  // stop previous request
  if (tout !== null) {
    clearTimeout(tout);
  }

  tout = setTimeout(() => compileWithCallback(files, cb), timeout);
}

export function compile(file: IFile, parseOnly = false): IDoubleCompilationResult {
  // compile to typescript
  let tsCompilationResult = compilej2ts(file, parseOnly);

  // in case there was an error during transpilation
  let result = {
    ts: tsCompilationResult.files,
    warnings: tsCompilationResult.warnings,
    errors: tsCompilationResult.errors
  };

  if (parseOnly || result.errors.length) {
    return result;
  }

  const sourceMap = tsCompilationResult.sourceMap;

  // compile from typescript to javascript
  const changedFile = tsCompilationResult.files['changed'];

  // rename the extension
  changedFile.name = changedFile.name.replace('.java', '') + '.ts';
  const jsCompilationResult = compilets2js(changedFile);

  // remap lines to correct positions
  for (let error of jsCompilationResult.errors) {
    error.line = sourceMap.resolveLine(error.line, error.column);
  }

  return {
    ts: tsCompilationResult.files,
    js: jsCompilationResult.files,
    warnings: jsCompilationResult.warnings,
    errors: jsCompilationResult.errors
  };
}
