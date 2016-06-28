import { mutation } from 'meteor/tomi:apollo-mantra';

export const CHANGE_STATE = 'SOLUTION: Change State';

export function changeState(solutionId: string, state: string) {
  return {
    type: CHANGE_STATE,
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
