import update from 'react-addons-update';
import * as actions from './text_editor_actions';

export interface IEditor {
  files: ITextFileDAO[];
  showAllFiles: boolean;
  activeTab: string;
  ownerId: string;
}

export interface IEditorState {
  editors: {
    [id: string]: IEditor
  };
}

function indexOf(arr: ITextFileDAO[], fileName: string) {
  let i = arr.find((f) => f.name === fileName);
  return arr.indexOf(i);
}

function init(state: IEditorState, id: string, ownerId: string, files: ITextFileDAO, showAllFiles: boolean) {
  return update(state, { editors: { [id]: { $set: { files, ownerId, showAllFiles } } } });
}

function changeTypeReduce(state: IEditorState, id: string, fileName: string, type: string) {
  const i = indexOf(state.editors[id].files, fileName);
  return update(state, { editors: { [id]: { files: { [i]: { type: { $set: type } } } } } });
}

function changeNameReduce(state: any, id: string, fileName: string, newName: string) {
  const i = indexOf(state.editors[id].files, fileName);
  return update(state, { editors: { [id]: { files: { [i]: { name: { $set: newName } } } } } });
}

function changeSourceReducer(state: any, id: string, fileName: string, source: string) {
  const i = indexOf(state.editors[id].files, fileName);
  return update(state, { editors: { [id]: { files: { [i]: { source: { $set: source } } } } } });
}

function addFileReduce(state: IEditorState, id: string, fileName: string, type: string) {
  return update(state, { editors: { [id]: { files: { $push: [{ name: fileName, type: type, source: '// new file' }] } } } });
}

function removeFileReduce(state: IEditorState, id: string, fileName: string) {
  const i = indexOf(state.editors[id].files, fileName);
  return update(state, { editors: { [id]: { files: { $splice: [[i, 1]] } } } });
}

function moveLeftReduce(state: IEditorState, id: string, fileName: string) {

  const files = state.editors[id].files;
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

  return update(state, { editors: { [id]: { files: { $set: newFiles } } } });
}

function moveRightReduce(state: IEditorState, id: string, fileName: string) {

  const files = state.editors[id].files;
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

  return update(state, { editors: { [id]: { files: { $set: newFiles } } } });
}


export function reducer (state = { editors: {}}, action: any) {
  switch (action.type) {
    case actions.TOGGLE_FILES:
      const show = state.editors[action.id].showAllFiles;
      return update(state, { editors: { [action.id]: { showAllFiles: { $set: !show } } } });
    case actions.INIT:
      return init(state, action.id, action.ownerId, action.files, action.showAllFiles);
    case actions.ADD_FILE:
      return addFileReduce(state, action.id, action.fileName, action.fileType);
    case actions.REMOVE_FILE:
      return removeFileReduce(state, action.id, action.fileName);
    case actions.RENAME_FILE:
      return changeNameReduce(state, action.id, action.oldFileName, action.newFileName);
    case actions.CHANGE_TYPE_FILE:
      return changeTypeReduce(state, action.id, action.fileName, action.fileType);
    case actions.CHANGE_SOURCE:
      return changeSourceReducer(state, action.id, action.fileName, action.source);
    case actions.FILE_MOVE_LEFT:
      return moveLeftReduce(state, action.id, action.fileName);
    case actions.FILE_MOVE_RIGHT:
      return moveRightReduce(state, action.id, action.fileName);
  }
  return state;
};
