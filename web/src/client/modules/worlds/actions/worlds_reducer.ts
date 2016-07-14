import { getQuery, copyQuery } from 'meteor/tomi:apollo-mantra';
import { ADD_FILE, REMOVE_FILE, RENAME_FILE, CHANGE_TYPE_FILE, CHANGE_SOURCE, FILE_MOVE_LEFT, FILE_MOVE_RIGHT } from './world_actions';
import { initReducer } from '../../text_editor/actions/text_editor_actions';

export interface IWorldState {
  filter: string;
  worlds: {
    [id: string]: IWorldDAO
  };
}

const fileReducer = initReducer('worlds', ADD_FILE, REMOVE_FILE, RENAME_FILE, CHANGE_TYPE_FILE, CHANGE_SOURCE, FILE_MOVE_LEFT, FILE_MOVE_RIGHT);

export function reducer (state = { worlds: {}}, action: any) {
  // query actions
  switch (getQuery(action)) {
    case 'worlds':
      console.log('World assign');
      return copyQuery(state, 'worlds', action.result.data.worlds);
  }

  // file reducer actions
  const fileReduce = fileReducer(state, action);
  if (fileReduce) {
    return fileReduce;
  }
  // switch (action.type) {
  //   case SEARCH:
  //     return Object.assign({}, state, { filter: action.text });
  //   case CLEAR_SEARCH:
  //     return Object.assign({}, state, { filter: '' });
  // }
  return state;
};
