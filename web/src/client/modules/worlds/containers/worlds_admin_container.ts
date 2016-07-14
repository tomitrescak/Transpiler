import Component, { IComponentProps } from '../components/worlds_view';
import queries from '../../../helpers/queries_helper';
import { connect, loadingContainer, queriesFinished } from 'meteor/tomi:apollo-mantra';

function objectToArray(worlds: any): IWorldDAO[] {
  let result: IWorldDAO[] = [];
  if (!worlds) {
    return result;
  }

  for (let world in worlds) {
    result.push(worlds[world]);
  }

  return result.sort((a, b) => a.name < b.name ? -1 : 1);
}


const mapQueriesToProps = (context: IContext, { state, ownProps }: IGraphQlProps<{}>): IGraphqlQuery => {
  return {
    data: {
      query: queries.worlds
    }
  };
};

export const mapStateToProps = (context: IContext, state: IState): IComponentProps => {
  // if (!queriesFinished(state.apollo)) {
  //   return {} as any;
  // }

  return {
    worlds: objectToArray(state.world.worlds),
    context
  };
};

export default connect({ mapQueriesToProps, mapStateToProps })(loadingContainer(Component));
