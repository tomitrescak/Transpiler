import { mutation } from 'meteor/tomi:apollo-mantra';
import * as commentActions from '../../comments/comments_actions';

export const CHANGE_STATE = 'SOLUTION: Change State';
export const CHANGE_FILE = 'SOLUTION: Change File';
export const CREATE_SOLUTION = 'SOLUTION: Create';
export const START_COMPILATION = 'SOLUTION: Compile';
export const COMPILATION_RESULT = 'SOLUTION: Compile Finish';
export const INSERT_COMMENT = 'SOLUTION: Insert Comment';


export function changeState(solutionId: string, state: string) {
  return {
    type: CHANGE_STATE,
    state
  }
}

const CommentMutation = `
  mutation solutionInsertComment(
    $solutionId: String!
    $comment: String!
  ) {
    solutionInsertComment(solutionId: $solutionId, comment: $comment) {
      id
      senderId
      senderName
      senderAvatar
      message
      sent
    }
  }
`;

export function insertComment(id: string, comment: string) {
  return {
    type: INSERT_COMMENT,
    id,
    comment
  };
}

export function addComment(e: React.SyntheticEvent, context: IContext, variables: any) {
  return commentActions.addComment(e, context, CommentMutation, variables,
    (data: any) => context.Store.dispatch(insertComment(variables.solutionId, data))
  );
}

export function changeFile(context: IContext, solutionId: string, fileName: string, source: string) {
  //const state = context.Store.getState();
  //const solution = state.solution.solutions[solutionId];
  // in case we are not currently compiling, start the compilation as well
  // if (!solution.compilationRunning) {
  //   setTimeout(() => context.Store.dispatch(), 500);
  // }

  return {
    type: CHANGE_FILE,
    solutionId,
    fileName,
    source
  };
};

export function createSolution(solution: ISolutionDAO) {
  return {
    type: CREATE_SOLUTION,
    solution
  };
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
