import Component, { IComponentProps, IComponentActions } from '../components/exercise_item_view';
import { connect, loadingContainer } from 'meteor/tomi:apollo-mantra';
import * as actions from '../actions/solution_actions';

interface IProps {
  exerciseId: string;
  practical: IPracticalDAO;
  schedule: IScheduleDAO;
}

export const mapDispatchToProps = (context: IContext, dispatch: Function, ownProps: IProps): IComponentActions => ({
  removeSubmission: (id: string) => {
    dispatch(actions.changeStateMutation(context, id, 'Open'));
  },
  submitSolution: (id: string) => {
    dispatch(actions.changeStateMutation(context, id, 'Submitted'));
  }
});

export const mapStateToProps = (context: IContext, state: IState, ownProps: IProps): IComponentProps => ({
  context,
  user: state.accounts.user,
  exercise: state.exercise.exercises[ownProps.exerciseId],
  solution: context.Utils.Class.find<ISolutionDAO>(
    state.solution.solutions, (s) =>
      s.scheduleId === ownProps.schedule._id && s.practicalId === ownProps.practical._id && s.exerciseId === ownProps.exerciseId)
});


export default connect<IProps>({ mapStateToProps, mapDispatchToProps })(Component);
