import update from 'react-addons-update';

declare global {
  interface IFileOwner {
    files: ITextFileDAO[];
  }
}

function indexOf(arr: ITextFileDAO[], fileName: string) {
  let i = arr.find((f) => f.name === fileName);
  return arr.indexOf(i);
}

function changeTypeReduce(state: any, key: string, id: string, fileName: string, type: string) {
  const i = indexOf(state[key][id].files, fileName);
  return update(state, { [key]: { [id]: { files: { [i]: { type: { $set: type } } } } } });
}

function changeNameReduce(state: any, key: string, id: string, fileName: string, newName: string) {
  const i = indexOf(state[key][id].files, fileName);
  return update(state, { [key]: { [id]: { files: { [i]: { name: { $set: newName } } } } } });
}

function changeSourceReducer(state: any, key: string, id: string, fileName: string, source: string) {
  const i = indexOf(state[key][id].files, fileName);
  return update(state, { [key]: { [id]: { files: { [i]: { source: { $set: source } } } } } });
}

function addFileReduce(state: any, key: string, id: string, fileName: string, type: string) {
  return update(state, { [key]: { [id]: { files: { $push: [{ name: fileName, type: type, source: '// new file' }] } } } });
}

function removeFileReduce(state: any, key: string, id: string, fileName: string) {
  const i = indexOf(state[key][id].files, fileName);
  return update(state, { [key]: { [id]: { files: { $splice: [[i, 1]] } } } });
}

function moveLeftReduce(state: any, key: string, id: string, fileName: string) {

  const files = state[key][id].files;
  const i = indexOf(files, fileName);

  if (i === 0) {
    return state;
  }

  const newFiles: ITextFileDAO[] = [];

  // recreate the array
  for (let f = 0; f < files.length; f++) {
    if (f === i - 1) {
      newFiles.push(files[f + 1]);
      newFiles.push(files[f]);
    } else if (i !== f) {
      newFiles.push(files[f]);
    }
  }

  return update(state, { [key]: { [id]: { files: { $set: newFiles } } } });
}

function moveRightReduce(state: any, key: string, id: string, fileName: string) {

  const files = state[key][id].files;
  const i = indexOf(files, fileName);

  if (i === files.length - 1) {
    return state;
  }

  const newFiles: ITextFileDAO[] = [];

  // recreate the array
  for (let f = 0; f < files.length; f++) {
    if (f === i) {
      newFiles.push(files[f + 1]);
      newFiles.push(files[f]);
    } else if (f !== i + 1) {
      newFiles.push(files[f]);
    }
  }

  return update(state, { [key]: { [id]: { files: { $set: newFiles } } } });
}

declare global {
  interface IFileEditorActions {
    addFile(fileName: string, fileType: string): void;
    removeFile(fileName: string): void;
    changeName(oldFileName: string, newFileName: string): void;
    changeType(fileName: string, fileType: string): void;
    changeSource(fileName: string, source: string, compile?: Function): void;
    moveLeft(fileName: string): void;
    moveRight(fileName: string): void;
    getFiles(store: IState): ITextFileDAO[];
    getLibraries(store: IState): ITextFileDAO[];
  }
}

export function initActions(getRecord: (state: IState, id: string) => IFileOwner,
  addAction: string,
  removeAction: string,
  changeNameAction: string,
  changeTypeAction: string,
  changeSourceAction: string,
  moveLeftAction: string,
  moveRightAction: string) {

  return (id: string, dispatch: Function) => {
    let timeoutId: number;

    return {
      addFile(fileName: string, fileType: string) {
        dispatch({ type: addAction, id, fileName, fileType });
      },
      removeFile(fileName: string) {
        dispatch({ type: removeAction, id, fileName });
      },
      changeName(oldFileName: string, newFileName: string) {
        dispatch({ type: changeNameAction, id, oldFileName, newFileName });
      },
      changeType(fileName: string, fileType: string) {
        dispatch({ type: changeTypeAction, id, fileName, fileType });
      },
      changeSource(fileName: string, source: string, compile?: Function) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          dispatch({ type: changeSourceAction, id, fileName, source });
          if (compile) { compile(); };
        }, 500);
      },
      moveLeft(fileName: string) {
        dispatch({ type: moveLeftAction, id, fileName });
      },
      moveRight(fileName: string) {
        dispatch({ type: moveRightAction, id, fileName });
      },
      getFiles(state: IState) {
        return getRecord(state, id).files.filter((f: ITextFileDAO) => !f.readonly);
      },
      getLibraries(state: IState) {
        return getRecord(state, id).files.filter((f: ITextFileDAO) => f.readonly);
      }
    };
  };
}

// reducer
export function initReducer(
  key: string,
  addAction: string,
  removeAction: string,
  changeNameAction: string,
  changeTypeAction: string,
  changeSourceAction: string,
  moveLeftAction: string,
  moveRightAction: string) {

  return (state: any, action: any) => {
    if (action.type === addAction) {
      return addFileReduce(state, key, action.id, action.fileName, action.fileType);
    } else if (action.type === removeAction) {
      return removeFileReduce(state, key, action.id, action.fileName);
    } else if (action.type === changeNameAction) {
      return changeNameReduce(state, key, action.id, action.oldFileName, action.newFileName);
    } else if (action.type === changeTypeAction) {
      return changeTypeReduce(state, key, action.id, action.fileName, action.fileType);
    } else if (action.type === changeSourceAction) {
      return changeSourceReducer(state, key, action.id, action.fileName, action.source);
    } else if (action.type === moveLeftAction) {
      return moveLeftReduce(state, key, action.id, action.fileName);
    } else if (action.type === moveRightAction) {
      return moveRightReduce(state, key, action.id, action.fileName);
    }
  };
}
