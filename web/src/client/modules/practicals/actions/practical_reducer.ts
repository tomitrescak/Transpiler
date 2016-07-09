import { SEARCH, CLEAR_SEARCH } from './practical_actions';
import { getQuery, copyQuery } from 'meteor/tomi:apollo-mantra';

export interface IPracticalState {
  practicals: {
    [id: string]: IPracticalDAO
  };
  filter: string;
}

export function reducer (state = { practicals: {}}, action: any) {
  switch (getQuery(action)) {
    case 'practical':
      return copyQuery(state, 'practicals', action.result.data.practical);
  }

  switch (action.type) {
    case SEARCH:
      return Object.assign({}, state, { filter: action.text });
    case CLEAR_SEARCH:
      return Object.assign({}, state, { filter: '' });
  }
  return state;
};
