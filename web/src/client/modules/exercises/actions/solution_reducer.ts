import { getQuery, copyQuery, IQueryResult } from 'meteor/tomi:apollo-mantra';
import { CHANGE_STATE, CREATE_SOLUTION, CHANGE_FILE } from './solution_actions';
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

function arrayObjectIndexOf(arr: Array<any>, property: string, value: any) {
  for (let i = 0, len = this.length; i < len; i++) {
    if (arr[i][property] === value) { return i };
  }
  return -1;
}

export function reducer(state: ISolutionState = { solutions: {} }, action: any) {

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
    case CHANGE_FILE:
      let solution = state.solutions[action.solutionId];
      let file = solution.files.find((f) => f.name === action.fileName);
      let idx = solution.files.indexOf(file);

      return update(state, { solutions: { [action.solutionId]: { files: { [idx]: { source: { $set: action.source } } } } } });
    case CREATE_SOLUTION:
      return update(state, { solutions: { $set: { [action.solution._id]: action.solution } } });
  }
  return state;
};
