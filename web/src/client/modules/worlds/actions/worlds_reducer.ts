import { getQuery, copyQuery } from 'meteor/tomi:apollo-mantra';

export interface IWorldState {
  filter: string;
  worlds: {
    [id: string]: IWorldDAO
  };
}


export function reducer (state = { worlds: {}}, action: any) {
  // query actions
  switch (getQuery(action)) {
    case 'worlds':
      console.log('World assign');
      return copyQuery(state, 'worlds', action.result.data.worlds);
  }

  // switch (action.type) {
  //   case SEARCH:
  //     return Object.assign({}, state, { filter: action.text });
  //   case CLEAR_SEARCH:
  //     return Object.assign({}, state, { filter: '' });
  // }
  return state;
};
