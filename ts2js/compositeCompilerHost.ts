// import {
//   ScriptTarget,
//   SourceFile,
//   Map,
//   CompilerHost,
//   createSourceFile,
// } from 'typescript';
//
// import { SourceType, StringSource } from './types';
//
// function shallowClone(obj: any) {
//   let clone: Map<string> = {};
//   for (let k in obj) {
//     if (obj.hasOwnProperty(k)) {
//       clone[k] = obj[k];
//     }
//   }
//   return clone;
// }
//
// export class CompositeCompilerHost implements CompilerHost {
//   public options: CompilerOptions;
//   public fallbackToFiles: boolean = false;
//   public readsFrom: SourceType = SourceType.File;
//   public writesTo: SourceType = SourceType.File;
//
//   // Implementing CompilerHost interface
//   writeFile: IResultWriterFn;
//
//   private _currentDirectory: string;
//   private _writer: IResultWriterFn;
//   private _sources: Map<string> = {};
//   private _outputs: Map<string> = {};
//
//   /**
//    * Whether to search for files if a string source isn't found or not
//    */
//   get sources(): Map<string> {
//     return shallowClone(this._sources);
//   }
//
//   get outputs(): Map<string> {
//     return shallowClone(this._outputs);
//   }
//
//   constructor(options: CompilerOptions) {
//     this.readsFrom = SourceType.String;
//     this.getSourceFile = this._readFromStrings;
//
//     this.writesTo = SourceType.String;
//     this.writeFile = this._writeToString;
//
//     this.options = options || {};
//     this.options.defaultLibFilename = this.options.defaultLibFilename || '';
//   }
//
//   // Implementing CompilerHost interface
//   getNewLine = (): string => '\n';
//
//   // Implementing CompilerHost interface
//   useCaseSensitiveFileNames(): boolean {
//     return true;
//   }
//
//   // Implementing CompilerHost interface
//   getSourceFile(fileName: string, languageVersion: ScriptTarget, onError?: (message: string) => void): SourceFile {
//     throw new Error('Not implemented');
//   }
//
//   readFile(fileName: string): string {
//     throw new Error('Not implemented');
//   }
//
//   fileExists(fileName: string): boolean {
//     throw new Error('Not implemented');
//   }
//
//   // Implementing CompilerHost interface
//   getCurrentDirectory(): string {
//     // if (this.getSourceFile === this._readFromStrings) {
//     //   return '';
//     // }
//     //
//     // return this._currentDirectory || (this._currentDirectory = ts.sys.getCurrentDirectory());
//     return '';
//   }
//
//   // Implementing CompilerHost interface
//   getDefaultLibFileName(): string {
//     return this.options.defaultLibFilename || 'lib.d.ts';
//   }
//
//   // Implementing CompilerHost interface
//   getCanonicalFileName(fileName: string): string {
//     // if underlying system can distinguish between two files whose names differs only in cases then file name already in canonical form.
//     // otherwise use toLowerCase as a canonical form.
//     return fileName;
//   }
//
//   readFromStrings(fallbackToFiles = false): CompositeCompilerHost {
//     this.fallbackToFiles = fallbackToFiles;
//     this.readsFrom = SourceType.String;
//     this.getSourceFile = this._readFromStrings;
//     return this;
//   }
//
//   addSource(contents: string): CompositeCompilerHost
//   addSource(contents: Source): CompositeCompilerHost
//   addSource(name: string, contents: string): CompositeCompilerHost
//   addSource(nameOrContents: any, contents?: any): CompositeCompilerHost {
//     let source: any;
//
//     if (typeof contents === 'undefined') {
//       source = new StringSource(nameOrContents);
//     } else {
//       source = new StringSource(contents, nameOrContents);
//     }
//
//     this._sources[source.filename] = source.contents;
//     return this;
//   }
//
//   getSourcesFilenames(): string[] {
//     let keys: any[] = [];
//
//     for (let k in this.sources) {
//       if (this.sources.hasOwnProperty(k)) {
//         keys.push(k);
//       }
//     }
//
//     return keys;
//   }
//
//   writeToString(): CompositeCompilerHost {
//     this.writesTo = SourceType.String;
//     this.writeFile = this._writeToString;
//     return this;
//   }
//
//   redirectOutput(writer: boolean): CompositeCompilerHost
//   redirectOutput(writer: IResultWriterFn): CompositeCompilerHost
//   redirectOutput(writer: any): CompositeCompilerHost {
//     if (typeof writer === 'function') {
//       this._writer = writer;
//     } else {
//       this._writer = null;
//     }
//
//     return this;
//   }
//
//   //////////////////////////////
//   // private methods
//   //////////////////////////////
//
//   private _readFromStrings(filename: string, languageVersion: ScriptTarget, onError?: (message: string) => void): SourceFile {
//     if (this._sources[filename]) {
//       return createSourceFile(filename, this._sources[filename], languageVersion, false);
//     }
//     return undefined;
//   }
//
//   private _writeToString(filename: string, data: string, writeByteOrderMark: boolean, onError?: (message: string) => void) {
//
//     this._outputs[filename] = data;
//
//     if (this._writer) {
//       this._writer(filename, data, writeByteOrderMark, onError);
//     }
//   }
// }
//
//
// export default CompositeCompilerHost;
