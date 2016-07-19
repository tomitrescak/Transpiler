export const INIT = 'EDITOR: Init';
export const ADD_FILE = 'EDITOR: Add File';
export const REMOVE_FILE = 'EDITOR: Remove File';
export const RENAME_FILE = 'EDITOR: Rename File';
export const CHANGE_TYPE_FILE = 'EDITOR: Change Type File';
export const CHANGE_SOURCE = 'EDITOR: Change source';
export const FILE_MOVE_LEFT = 'EDITOR: File Move Left';
export const FILE_MOVE_RIGHT = 'EDITOR: File Move Right';
export const TOGGLE_FILES = 'EDITOR: Toggle Files';

declare global {
  interface IFileOwner {
    files: ITextFileDAO[];
  }
}

declare global {
  interface IFileEditorActions {
    toggleShowAllFiles(): void;
    init(files: ITextFileDAO[], ownerId: string, showAllfiles: boolean): void;
    addFile(fileName: string, fileType: string): void;
    removeFile(fileName: string): void;
    changeName(oldFileName: string, newFileName: string): void;
    changeType(fileName: string, fileType: string): void;
    changeSource(fileName: string, source: string, compile?: Function): void;
    moveLeft(fileName: string): void;
    moveRight(fileName: string): void;
    getFiles(allfiles?: boolean): ITextFileDAO[];
    getLibraries(): ITextFileDAO[];
  }
}

export default function initActions(id: string, store: IStore): IFileEditorActions {
  let timeoutId: number;

  return {
    init(files: ITextFileDAO[], ownerId: string, showAllFiles: boolean) {
      store.dispatch({ type: INIT, id, ownerId, files, showAllFiles });
    },
    toggleShowAllFiles() {
      store.dispatch({ type: TOGGLE_FILES, id });
    },
    addFile(fileName: string, fileType: string) {
      store.dispatch({ type: ADD_FILE, id, fileName, fileType });
    },
    removeFile(fileName: string) {
      store.dispatch({ type: REMOVE_FILE, id, fileName });
    },
    changeName(oldFileName: string, newFileName: string) {
      store.dispatch({ type: RENAME_FILE, id, oldFileName, newFileName });
    },
    changeType(fileName: string, fileType: string) {
      store.dispatch({ type: CHANGE_TYPE_FILE, id, fileName, fileType });
    },
    changeSource(fileName: string, source: string, compile?: Function) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        store.dispatch({ type: CHANGE_SOURCE, id, fileName, source });
        if (compile) { compile(); };
      }, 500);
    },
    moveLeft(fileName: string) {
      store.dispatch({ type: FILE_MOVE_LEFT, id, fileName });
    },
    moveRight(fileName: string) {
      store.dispatch({ type: FILE_MOVE_RIGHT, id, fileName });
    },
    getFiles(allFiles = false) {
      const files = store.getState().editor.editors[id].files;
      return allFiles ? files : files.filter((f: ITextFileDAO) => !f.readonly);
    },
    getLibraries() {
      return store.getState().editor.editors[id].files.filter((f: ITextFileDAO) => f.readonly);
    }
  };
};
