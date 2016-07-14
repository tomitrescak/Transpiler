import Component, { IComponentProps, IComponentActions } from '../components/world_admin_view';
import queries from '../../../helpers/queries_helper';
import { connect, loadingContainer, queriesFinished } from 'meteor/tomi:apollo-mantra';
import * as actions from '../actions/world_actions';

interface IProps {
  params: {
    id: string
  }
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
  fileActions: actions.fileActions(ownProps.params.id, dispatch),
  save(world: IWorldDAO) {
    dispatch(actions.save(context, world));
  }
});

export default connect({ mapQueriesToProps, mapStateToProps, mapDispatchToProps })(loadingContainer(Component));
