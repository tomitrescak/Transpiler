import { connect } from 'meteor/tomi:apollo-mantra';
import Component, { IComponentProps, IComponentActions } from './comments_view';
import * as actions from './comments_actions';

export interface IProps {
  owner: ICommentable;
  query: string;
  queryVariables: Object;
  insertFunction: string;
}

const mapStateToProps = (context: IContext, state: IState, ownProps: IProps): IComponentProps => ({
  context: context
});

const mapDispatchToProps = (context: IContext, dispatch: Function, ownProps: IProps): IComponentActions => ({
  addComment: (e: React.SyntheticEvent, text: string) => {
    e.preventDefault();

    let vars = Object.assign({}, ownProps.queryVariables, { comment: text });
    dispatch(
      actions.addComment(e,
        ownProps.owner,
        text, context,
        ownProps.query,
        vars,
        (data: any) => dispatch(actions.insert(ownProps.insertFunction, ownProps.owner._id, data))
      )
    );
  }
});

export default connect<IProps>({ mapStateToProps, mapDispatchToProps })(Component);
