import { INIT_SESSION, START_COMPILATION, COMPILATION_SUCCESS, COMPILATION_ERROR, TOGGLE_FILES } from './compiler_actions';
import update from 'react-addons-update';

export interface ICompilerState {
  sessions: {
    [id: string]: ICompilerSession
  };
}

export function reducer(state: ICompilerState = { sessions: {} }, action: any) {
  switch (action.type) {
    case TOGGLE_FILES:
      return update(state, { sessions: { [action.sessionId]: { showAllFiles: { $set: !state.sessions[action.sessionId].showAllFiles } } } });
    case INIT_SESSION:
      if (!state.sessions[action.sessionId]) {
        state.sessions[action.sessionId] = {} as any;
      }
      return update(state, {
        sessions: {
          [action.sessionId]: {
            id: { $set: action.session.id },
            state: { $set: action.session.state },
            libraries: { $set: action.session.libraries },
            files: { $set: action.session.files },
            errors: { $set: action.session.errors }
          }
        }
      });
    case START_COMPILATION:
      return update(state, { sessions: { [action.sessionId]: { state: { $set: 'Compiling' } } } });
    case COMPILATION_ERROR:
      return update(state, { sessions: { [action.sessionId]: { state: { $set: 'Error' }, errors: { $set: action.errors } } } });
    case COMPILATION_SUCCESS:
      return update(state, { sessions: { [action.sessionId]: { state: { $set: 'Success' }, errors: { $set: {} }, files: { $set: action.files } } } });
  }
  return state;
};
