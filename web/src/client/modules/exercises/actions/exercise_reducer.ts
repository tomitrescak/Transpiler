import { SEARCH, CLEAR_SEARCH } from './practical_actions';
import { isQuery } from 'meteor/tomi:apollo-mantra';

export interface IPracticalState {
  practicals: {
    [id: string]: IPracticalDAO
  };
  filter: string;
}

export function reducer (state = { practicals: {}}, action: any) {
  if (isQuery(action, 'practical')) {
    const newPracticals = Object.assign({}, state.practicals);
    const practical = action.result.data.practical;
    newPracticals[practical._id] = practical;

    return Object.assign({}, state, { practicals: newPracticals });
  }
  switch (action.type) {
    case SEARCH:
      return Object.assign({}, state, { filter: action.text });
    case CLEAR_SEARCH:
      return Object.assign({}, state, { filter: '' });
  }
  return state;
};
