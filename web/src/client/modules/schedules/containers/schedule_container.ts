import Component, { IComponentProps } from '../components/schedule_view';
import { connect, loadingContainer } from 'meteor/tomi:apollo-mantra';

interface IProps {
  params: {
    id: string;
  };
}

const mapQueriesToProps = (context: IContext, { state, ownProps }: IGraphQlProps<IProps>): IGraphqlQuery => {
  return {
    data: {
      query: gql`
      query schedule($id: String, $userId: String) {
        schedule(id: $id, userId: $userId) {
          _id
          name
          description
          startDate
          totalExercises,
          items {
            from
            due
            practicalId
            name
          }
          tutors {
            id
            name
            email
          }
          practicals {
            _id
            name
            image
            description
            createdBy
            updatedAt
            permissions {
              owner
              ownerAccess
              otherAccess
            }
          }
        }
      }`,
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
