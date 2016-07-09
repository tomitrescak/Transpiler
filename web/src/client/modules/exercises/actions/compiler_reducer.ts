import { INIT_SESSION, START_COMPILATION, COMPILATION_SUCCESS, COMPILATION_ERROR, ICompilerSession } from './compiler_actions';
import update from 'react-addons-update';

export interface ICompilerState {
  sessions: {
    [id: string]: ICompilerSession
  };
}

export function reducer (state: ICompilerState = { sessions: {}}, action: any) {
  switch (action.type) {
    case INIT_SESSION:
      return update(state, { sessions: { [action.sessionId]: { $set: action.session } } });
    case START_COMPILATION:
      return update(state, { sessions: { [action.sessionId]: { state: { $set: 'Compiling' } } } });
    case COMPILATION_ERROR:
      return update(state, { sessions: { [action.sessionId]: { state: { $set: 'Error' }, errors: { $set: action.errors } } } });
    case COMPILATION_SUCCESS:
      return update(state, { sessions: { [action.sessionId]: { state: { $set: 'Success' }, errors: { $set: {} }, files: { $set: action.files } } } });
  }
  return state;
};
