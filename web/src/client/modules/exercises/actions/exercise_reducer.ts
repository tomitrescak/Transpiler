import { SEARCH, CLEAR_SEARCH } from './exercise_actions';
import { getQuery, IQueryResult } from 'meteor/tomi:apollo-mantra';

export interface IExerciseState {
  exercises: {
    [id: string]: IExerciseDAO
  };
  filter: string;
}

export function reducer (state = { exercises: {}}, action: any) {
  switch (getQuery(action)) {
    case 'practical':
      if (action.result.data.practical.exercises) {
        // query maps
        const newExercises = Object.assign({}, state.exercises);
        const practicalExercises: IExerciseDAO[] = action.result.data.practical.exercises;
        // copy all exercises to the new state
        practicalExercises.forEach((e) => newExercises[e._id] = e);
        return Object.assign({}, state, { exercises: newExercises });
      }
      return state;
  }


  switch (action.type) {
    case SEARCH:
      return Object.assign({}, state, { filter: action.text });
    case CLEAR_SEARCH:
      return Object.assign({}, state, { filter: '' });
  }
  return state;
};
