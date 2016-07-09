import Component, { IComponentProps } from '../components/schedule_view';
import { connect, loadingContainer } from 'meteor/tomi:apollo-mantra';
import queries from '../../../helpers/queries_helper';

interface IProps {
  params: {
    id: string;
  };
}

const mapQueriesToProps = (context: IContext, { state, ownProps }: IGraphQlProps<IProps>): IGraphqlQuery => {
  return {
    data: {
      query: queries.schedule,
      variables: {
        id: ownProps.params.id,
        userId: state.accounts.userId
      },
    }
  };
};

export const mapStateToProps = (context: IContext, state: IState, ownProps: IProps): IComponentProps => ({
  context,
  user: state.accounts.user
});


export default connect({ mapQueriesToProps, mapStateToProps })(loadingContainer(Component));
