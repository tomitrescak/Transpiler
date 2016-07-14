import { SEARCH, CLEAR_SEARCH } from './exercise_actions';
import { getQuery, copyQuery, IQueryResult } from 'meteor/tomi:apollo-mantra';

export interface IExerciseState {
  exercises: {
    [id: string]: IExerciseDAO
  };
  filter: string;
}

export function reducer (state = { exercises: {}}, action: any) {
  switch (getQuery(action)) {
    case 'exercise':
      return copyQuery(state, 'exercises', action.result.data.exercise);
    case 'practical':
      if (action.result.data.practical) {
        return copyQuery(state, 'exercises', action.result.data.practical.exercises, '_id', false);
      }
      break;
  }


  switch (action.type) {
    case SEARCH:
      return Object.assign({}, state, { filter: action.text });
    case CLEAR_SEARCH:
      return Object.assign({}, state, { filter: '' });
  }
  return state;
};
