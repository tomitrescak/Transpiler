import * as ts from 'typescript';
import lib from './lib';

interface IMessage {
  file?: string;
  line: number;
  column: number;
  message: string;
}

interface ICompiledFile {
  version?: number;
  name?: string;
  source?: string;
  result?: string;
}

interface ICompilationResult {
  files: ts.Map<ICompiledFile>;
  warnings: IMessage[];
  errors: IMessage[];
}

let emit: (fileName: string) => void;
let files: ts.Map<ICompiledFile> = {};
let result: ICompilationResult;

export function serviceCompile(file: ICompiledFile): ICompilationResult {

  console.log(files)

  // change in version
  if (!files[file.name]) {
    files[file.name] = {
      version: 0,
      name: file.name,
    };
  }

  // create new result
  result = {
    files: files,
    warnings: [],
    errors: []
  };

  // modify current source
  files[file.name].source = file.source;

  // emit
  emit(file.name);

  // return changes
  return result;
}

export function initService(rootFileNames: ICompiledFile[], options?: ts.CompilerOptions) {
  files = {};

  // initialize the list of files
  rootFileNames.forEach(file => {
    files[file.name] = {
      version: 0,
      source: file.source,
      name: file.name
    };
  });

  // Create the language service host to allow the LS to communicate with the host
  const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => {
      let names: string[] = [];
      for (let file in files) {
        names.push(files[file].name);
      }
      return names;
    },
    getScriptVersion: (fileName) => files[fileName] && files[fileName].version.toString(),
    getScriptSnapshot: (fileName) => {
      if (fileName.substring(fileName.length - 8) === 'lib.d.ts') {
        return ts.ScriptSnapshot.fromString(lib);
      }
      return ts.ScriptSnapshot.fromString(files[fileName].source);
    },
    getCurrentDirectory: () => '',
    getCompilationSettings: () => options,
    getDefaultLibFileName: (opts) => ts.getDefaultLibFilePath(opts),
  };

  // Create the language service files
  const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry())

  // assign the global emit function
  emit = (fileName: string) => {
    // console.log(servicesHost.getScriptFileNames())

    // Update the version to signal a change in the file
    files[fileName].version++;

    // write the changes to disk
    emitFile(fileName);
  };

  // Now let's watch the files
  rootFileNames.forEach(file => {
    // First time around, emit all files
    emitFile(file.name);
  });

  function emitFile(fileName: string) {
    let output = services.getEmitOutput(fileName);

    logErrors(fileName);

    if (!output.emitSkipped) {
      // console.log(`Emitting ${fileName}`);
    } else {
      // console.log(`Emitting ${fileName} failed`);
      logErrors(fileName);
    }

    output.outputFiles.forEach(o => {
      files[o.name.replace('.js', '.ts')].result = o.text;
    });
  }

  function logErrors(fileName: string) {
    let allDiagnostics = services.getCompilerOptionsDiagnostics()
      .concat(services.getSyntacticDiagnostics(fileName))
      .concat(services.getSemanticDiagnostics(fileName));

    allDiagnostics.forEach(diagnostic => {
      let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      if (diagnostic.file) {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);

        let category = ts.DiagnosticCategory[diagnostic.category].toLowerCase();
        let mess: IMessage = {
          message,
          line: line,
          column: character,
          file: diagnostic.file.fileName
        };
        if (category === 'warning') {
          result.warnings.push(mess);
        } else {
          result.errors.push(mess);
        }

        // console.log(`  Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
      } else {
        result.errors.push({
          message,
          line: 0,
          column: 0,
          file: null
        });
        // console.log(`  Error: ${message}`);
      }
    });
  }
}

// Start the watcher
// watch(currentDirectoryFiles, { module: ts.ModuleKind.CommonJS });
