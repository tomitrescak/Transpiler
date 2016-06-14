import * as ts from 'typescript';
import { SourceType, CompilerOptions, IResultWriterFn, Source, StringSource } from './types';
import * as path from 'path';

function shallowClone(obj: any) {
  let clone: ts.Map<string> = {};
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      clone[k] = obj[k];
    }
  }
  return clone;
}

export class CompositeCompilerHost implements ts.CompilerHost {
  public options: CompilerOptions;
  public fallbackToFiles: boolean = false;
  public readsFrom: SourceType = SourceType.File;
  public writesTo: SourceType = SourceType.File;

  // Implementing CompilerHost interface
  writeFile: IResultWriterFn;

  private _currentDirectory: string;
  private _writer: IResultWriterFn;
  private _sources: ts.Map<string> = {};
  private _outputs: ts.Map<string> = {};

  /**
   * Whether to search for files if a string source isn't found or not
   */
  get sources(): ts.Map<string> {
    return shallowClone(this._sources);
  }

  get outputs(): ts.Map<string> {
    return shallowClone(this._outputs);
  }

  constructor(options: CompilerOptions) {
    this.readsFrom = SourceType.File;
    this.getSourceFile = this._readFromFile;

    this.writesTo = SourceType.File;
    this.writeFile = this._writeToFile;

    this.options = options || {};
    this.options.defaultLibFilename = this.options.defaultLibFilename || '';
  }

  // Implementing CompilerHost interface
  getNewLine = (): string => '\n';

  // Implementing CompilerHost interface
  useCaseSensitiveFileNames(): boolean {
    return ts.sys.useCaseSensitiveFileNames;
  }

  // Implementing CompilerHost interface
  getSourceFile(fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void): ts.SourceFile {
    throw new Error('Not implemented');
  }

  readFile(fileName: string): string {
    throw new Error('Not implemented');
  }

  fileExists(fileName: string): boolean {
    throw new Error('Not implemented');
  }

  // Implementing CompilerHost interface
  getCurrentDirectory(): string {
    if (this.getSourceFile === this._readFromStrings) {
      return '';
    }

    return this._currentDirectory || (this._currentDirectory = ts.sys.getCurrentDirectory());
  }

  // Implementing CompilerHost interface
  getDefaultLibFileName(): string {
    return this.options.defaultLibFilename || path.join(__dirname, 'lib', 'lib.d.ts');
  }

  // Implementing CompilerHost interface
  getCanonicalFileName(fileName: string): string {
    // if underlying system can distinguish between two files whose names differs only in cases then file name already in canonical form.
    // otherwise use toLowerCase as a canonical form.
    return ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
  }

  readFromStrings(fallbackToFiles = false): CompositeCompilerHost {
    this.fallbackToFiles = fallbackToFiles;
    this.readsFrom = SourceType.String;
    this.getSourceFile = this._readFromStrings;
    return this;
  }

  readFromFiles(): CompositeCompilerHost {
    this.readsFrom = SourceType.File;
    this.getSourceFile = this._readFromFile;
    return this;
  }

  addSource(contents: string): CompositeCompilerHost
  addSource(contents: Source): CompositeCompilerHost
  addSource(name: string, contents: string): CompositeCompilerHost
  addSource(nameOrContents: any, contents?: any): CompositeCompilerHost {
    let source: any;

    if (typeof contents === 'undefined') {
      source = new StringSource(nameOrContents);
    } else {
      source = new StringSource(contents, nameOrContents);
    }

    this._sources[source.filename] = source.contents;
    return this;
  }

  getSourcesFilenames(): string[] {
    let keys: any[] = [];

    for (let k in this.sources) {
      if (this.sources.hasOwnProperty(k)) {
        keys.push(k);
      }
    }

    return keys;
  }

  writeToString(): CompositeCompilerHost {
    this.writesTo = SourceType.String;
    this.writeFile = this._writeToString;
    return this;
  }

  writeToFiles(): CompositeCompilerHost {
    this.writesTo = SourceType.File;
    this.writeFile = this._writeToFile;
    return this;
  }

  redirectOutput(writer: boolean): CompositeCompilerHost
  redirectOutput(writer: IResultWriterFn): CompositeCompilerHost
  redirectOutput(writer: any): CompositeCompilerHost {
    if (typeof writer === 'function') {
      this._writer = writer;
    } else {
      this._writer = null;
    }

    return this;
  }

  //////////////////////////////
  // private methods
  //////////////////////////////

  private _readFromStrings(filename: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void): ts.SourceFile {

    if (path.normalize(filename) === this.getDefaultLibFileName()) {
      return this._readFromFile(filename, languageVersion, onError);
    }

    if (this._sources[filename]) {
      return ts.createSourceFile(filename, this._sources[filename], languageVersion, false);
    }

    if (this.fallbackToFiles) {
      return this._readFromFile(filename, languageVersion, onError);
    }

    return undefined;
  }

  private _writeToString(filename: string, data: string, writeByteOrderMark: boolean, onError?: (message: string) => void) {

    this._outputs[filename] = data;

    if (this._writer) {
      this._writer(filename, data, writeByteOrderMark, onError);
    }
  }

  private _readFromFile(filename: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void): ts.SourceFile {
    let text: string = null;
    try {
      text = ts.sys.readFile(path.normalize(filename));
    } catch (e) {
      if (onError) {
        onError(e.message);
      }

      text = '';
    }
    return text !== undefined ? ts.createSourceFile(filename, text, languageVersion, false) : undefined;
  }

  private _writeToFile(fileName: string, data: string, writeByteOrderMark: boolean, onError?: (message: string) => void) {
    let existingDirectories: ts.Map<boolean> = {};

    function directoryExists(directoryPath: string): boolean {
      if (ts.hasProperty(existingDirectories, directoryPath)) {
        return true;
      }
      if (ts.sys.directoryExists(directoryPath)) {
        existingDirectories[directoryPath] = true;
        return true;
      }
      return false;
    }

    function ensureDirectoriesExist(directoryPath: string) {
      if (directoryPath.length > ts.getRootLength(directoryPath) && !directoryExists(directoryPath)) {
        let parentDirectory = ts.getDirectoryPath(directoryPath);
        ensureDirectoriesExist(parentDirectory);
        ts.sys.createDirectory(directoryPath);
      }
    }

    try {
      if (this._writer) {
        this._writer(fileName, data, writeByteOrderMark, onError);
      } else {
        ensureDirectoriesExist(ts.getDirectoryPath(ts.normalizePath(fileName)));
        ts.sys.writeFile(fileName, data, writeByteOrderMark);
      }
      this._outputs[fileName] = (writeByteOrderMark ? '\uFEFF' : '') + data;
    } catch (e) {
      if (onError) { onError(e.message); }
    }
  }
}


export default CompositeCompilerHost;
