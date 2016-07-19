import Component, { IComponentProps, IComponentActions, EDITOR_ID } from '../components/world_admin_view';
import queries from '../../../helpers/queries_helper';
import { connect, loadingContainer, queriesFinished } from 'meteor/tomi:apollo-mantra';
import * as actions from '../actions/world_actions';
import editorActions from '../../text_editor/actions/text_editor_actions';

interface IProps {
  params: {
    id: string
  };
}

const mapQueriesToProps = (context: IContext, { state, ownProps }: IGraphQlProps<{}>): IGraphqlQuery => {
  return {
    data: {
      query: queries.worlds
    }
  };
};

export const mapStateToProps = (context: IContext, state: IState, ownProps: IProps): IComponentProps => {
  // if (!queriesFinished(state.apollo)) {
  //   return {} as any;
  // }

  return {
    world: state.world.worlds[ownProps.params.id],
    context
  };
};

export const mapDispatchToProps = (context: IContext, dispatch: Function, ownProps: IProps): IComponentActions => ({
  fileActions: editorActions(EDITOR_ID, context.Store),
  save(world: IWorldDAO) {
    // first save the modified files
    world.files = context.Store.getState().editor.editors[EDITOR_ID].files;

    // now save the whole document
    dispatch(actions.save(context, world));
  }
});

export default connect({ mapQueriesToProps, mapStateToProps, mapDispatchToProps })(loadingContainer(Component));
