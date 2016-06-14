import { ScriptTarget, SourceFile } from 'typescript';

declare global {
  export interface Source {
    type: SourceType;
    filename?: string;
    contents?: string;
  }

  export interface CompilationError {
    file: string;
    line: number;
    column: number;
    category: string;
    code?: number;
    message: string;
  }

  export interface CompilationResult {
    sources: { [index: string]: string };
    sourceMaps?: {};
    errors: CompilationError[];
  }

  export interface CompilerOptions {
    defaultLibFilename?: string;
  }

  export interface ISourceReaderFn {
    (filename: string, languageVersion?: ScriptTarget, onError?: (message: string) => void): SourceFile;
  }

  export interface IResultWriterFn {
    (filename: string, data: string, writeByteOrderMark?: boolean, onError?: (message: string) => void): any;
  }
}

export enum SourceType { File, String }

export class StringSource implements Source {
  private static _counter = 0;

  type: SourceType = SourceType.String;

  private static _nextFilename() {
    return 'input_string' + (++StringSource._counter) + '.ts';
  }

  constructor(public contents: string, public filename: string = StringSource._nextFilename()) {
  }

  resetCounter() {
    StringSource._counter = 0;
  }
}

export class FileSource implements Source {
  type: SourceType = SourceType.File;

  constructor(public filename: string) {
  }
}
