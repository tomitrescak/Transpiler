export const INIT_SESSION = 'COMPILER: INIT';
export const START_COMPILATION = 'COMPILER: START';
export const COMPILATION_ERROR = 'COMPILER: ERROR';
export const COMPILATION_SUCCESS = 'COMPILER: SUCCESS';
export const TOGGLE_FILES = 'COMPILER: TOGGLE FILES';

declare global {
  interface ICompilerErrors {
    [fileName: string]: ICompilerError[];
  }

  interface ICompilerError {
    row: number;
    column: number;
    text: string;
    type: string;
  }

  export interface ICompilerSession {
    id: string;
    state: 'Compiling' | 'Error' | 'Success';
    libraries: string[];
    files: String[];
    errors: ICompilerErrors;
    showAllFiles: boolean;
  }
}

export function toggleShowAllFiles(sessionId: string, show: boolean) {
  return {
    type: TOGGLE_FILES,
    sessionId,
    show
  };
}

export function initSession(id: string, libraries: string[]) {
  return {
    type: INIT_SESSION,
    sessionId: id,
    session: {
      id,
      state: 'Initialised',
      libraries,
      files: <ITextFileDAO[]>[],
      errors: {}
    }
  };
}

export function startCompilation(sessionId: string) {
  return {
    type: START_COMPILATION,
    sessionId
  };
};

export function compilationError(sessionId: string, errors: ICompilerErrors) {
  return {
    type: COMPILATION_ERROR,
    sessionId,
    errors
  };
};

export function compilationSuccess(sessionId: string, files: java2jscompiler.ICompiledFile[]) {
  return {
    type: COMPILATION_SUCCESS,
    sessionId,
    files
  };
};

// async actions

export function initCompiler(sessionId: string, files: java2jscompiler.IFile[]) {

  return function(dispatch: Function) {
    java2js.initService([]);

    let result: java2jscompiler.IDoubleCompilationResult;
    for (let file of files) {
      result = java2js.compile(file);
      if (result.errors.length) {
        dispatch(initSession(sessionId, []));
        console.error('There were compilation errors in base library, file: ' + file.name);
        console.error(result.errors);
        // throw new Error('There were compilation errors in base library, file: ' + file.name);
      }
    }

    // copy to Array
    const cf: string[] = [];
    if (result) {
      for (let file in result.js) {
        cf.push(result.js[file].result);
      }
    }


    dispatch(initSession(sessionId, cf));
  };
}

function compileCallback(dispatch: Function, sessionId: string, files: java2jscompiler.IFile[], result: java2jscompiler.IAsyncCompilationResult) {
  console.log(result);

  if (result.errors) {
    let errors = {};
    // transform errors
    for (let errorSet in result.errors) {
      let annotations: ICompilerError[] = result.errors[errorSet].map((e: any) => ({
        row: e.line,
        column: 0,
        text: e.message,
        type: 'error'
      }));
      errors[errorSet] = annotations;
    }
    dispatch(compilationError(sessionId, errors));
  } else {
    // copy result into Array
    let compiledFiles: java2jscompiler.ICompiledFile[] = [];
    for (let f in result.files) {

      // filter only the files from the session
      if (files.find((ff) => f === ff.name)) {
        compiledFiles.push({ name: f, source: result.files[f].result });
      }
    }
    dispatch(compilationSuccess(sessionId, compiledFiles));
  }
}

export function compile(store: IStore, sessionId: string, files: java2jscompiler.IFile[]) {
  return function(dispatch: Function) {
    if (store.getState().compiler.sessions[sessionId].state !== 'Compiling') {
      dispatch(startCompilation(sessionId));
    }
    java2js.compileAsync(files, compileCallback.bind(null, dispatch, sessionId, files), 10);
  };
}
