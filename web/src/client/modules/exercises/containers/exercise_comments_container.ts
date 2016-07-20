import { connect } from 'meteor/tomi:apollo-mantra';
import Component, { IComponentProps, IComponentActions } from '../../comments/comments_view';
import * as actions from '../actions/solution_actions';

interface IProps {
  solutionId: string;
}

const mapStateToProps = (context: IContext, state: IState, ownProps: IProps): IComponentProps => ({
  owner: state.solution.solutions[ownProps.solutionId],
  context
});

const mapDispatchToProps = (context: IContext, dispatch: Function, ownProps: IProps): IComponentActions => ({
  addComment: (e: React.SyntheticEvent, text: string) => {
    e.preventDefault();

    let vars = {
      solutionId: ownProps.solutionId,
      comment: text
    };
    dispatch(actions.addComment(e, context, vars));
  }
});

export default connect<IProps>({ mapStateToProps, mapDispatchToProps })(Component);
