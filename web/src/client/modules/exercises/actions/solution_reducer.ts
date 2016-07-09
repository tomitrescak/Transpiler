import { getQuery, copyQuery, IQueryResult } from 'meteor/tomi:apollo-mantra';
import { CHANGE_STATE } from './solution_actions';
import update from 'react-addons-update';

export interface ISolutionState {
  solutions: {
    [id: string]: ISolutionDAO
  };
}

// function modifySolution(state: ISolutionState, id: string, setter: Object) {
//   const newSolution = Object.assign({}, state.solutions[id], setter);
//   const newSolutions = Object.assign({}, state.solutions);
//   newSolutions[id] = newSolution;
//   return Object.assign({}, state, { solutions: newSolutions });
// }

export function reducer (state = { solutions: {} }, action: any) {

  // query listener moves query data into store

  switch (getQuery(action)) {
    case 'practicalSolutions':
      return copyQuery(state, 'solutions', action.result.data.practicalSolutions);
    case 'solution':
      return copyQuery(state, 'solutions', action.result.data.solution);
  }

  // action listener

  switch (action.type) {
    case CHANGE_STATE:
      return update(state, { solutions: { [action.solutionId]: { status: { $set: action.status } } } });
  }
  return state;
};
