import { mutation } from 'meteor/tomi:apollo-mantra';

export const CHANGE_STATE = 'SOLUTION: Change State';
export const CHANGE_FILE = 'SOLUTION: Change File';
export const START_COMPILATION = 'SOLUTION: Compile';
export const COMPILATION_RESULT = 'SOLUTION: Compile Finish';

export function changeState(solutionId: string, state: string) {
  return {
    type: CHANGE_STATE,
    state
  }
}

export function changeFile(context: IContext, solutionId: string, fileName: string, source: string) {
  const state = context.Store.getState();
  const solution = state.solution.solutions[solutionId];

  // in case we are not currently compiling, start the compilation as well
  if (!solution.compilationRunning) {
    setTimeout(() => context.Store.dispatch(), 500);
  }

  return {
    type: CHANGE_FILE,
    state
  }
}

export function changeStateMutation(context: IContext, solutionId: string, solutionState: string) {

  // optimistic update
  const state = context.Store.getState();
  const originalState = state.solution.solutions[solutionId].status;

  return mutation({
    query: `
      mutation changeSolutionState(
        $solutionId: String!
        $status: String
      ) {
        changeSolutionState(id: $solutionId, status: $status)
      }
    `,
    variables: {
      solutionId,
      status: solutionState
    },
    optimisticCallback(dispatch: any) {
      dispatch({
        type: CHANGE_STATE,
        status: solutionState,
        solutionId
      });
    },
    errorCallback(data: any, dispatch: any) {
      dispatch({
        type: CHANGE_STATE,
        status: originalState,
        solutionId
      });
    }
  });
}
