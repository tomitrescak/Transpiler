import { initService as initj2ts, serviceCompile as compilej2ts } from '../java2ts/index';
import { initService as initts2js, serviceCompile as compilets2js  } from '../ts2js/index';

interface IFile {
  name: string;
  source: string;
}

export function initService(files: IFile[] = []) {
  initj2ts(files);
  initts2js(files);
}

interface IDoubleCompilationResult {
  ts?: Map<ICompiledFile>;
  js?: Map<ICompiledFile>;
  errors: IMessage[];
  warnings: IMessage[];
}

export function compile(file: IFile, parseOnly = false): IDoubleCompilationResult {
  // compile to typescript
  let tsCompilationResult = compilej2ts(file, parseOnly);

  // in case there was an error during transpilation
  let result = {
    ts: tsCompilationResult.files,
    warnings: tsCompilationResult.warnings,
    errors: tsCompilationResult.errors
  }

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
