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

export function compile(file: IFile): IDoubleCompilationResult {
  // compile to typescript
  let tsCompilationResult = compilej2ts(file);

  // in case there was an error during transpilation
  if (tsCompilationResult.errors.length > 0) {
    return {
      ts: tsCompilationResult.files,
      warnings: tsCompilationResult.warnings,
      errors: tsCompilationResult.errors
    };
  }

  // compile from typescript to javascript
  let changedFile = tsCompilationResult.files['changed'];

  // rename the extension
  changedFile.name = changedFile.name.replace('.java', '') + '.ts';
  let jsCompilationResult = compilets2js(changedFile);

  return {
    ts: tsCompilationResult.files,
    js: jsCompilationResult.files,
    warnings: jsCompilationResult.warnings,
    errors: jsCompilationResult.errors
  };
}
