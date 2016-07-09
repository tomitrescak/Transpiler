import Component, { IComponentProps, IComponentActions } from '../components/schedule_list_view';
import { connect, loadingContainer } from 'meteor/tomi:apollo-mantra';
import * as actions from '../actions/schedule_actions';

interface IProps {
  context?: () => IContext;
  clearSearch?: Function;
  header: string;
  route: string;
  showBadges: boolean;
  icon: string;
}

const mapQueriesToProps = (context: IContext, { state }: any): IGraphqlQuery => {
  return {
    data: {
      query: gql`
      query schedules($userId: String) {
        schedules(userId: $userId) {
          _id
          name
          description
          startDate
          totalExercises
          achievements {
            _id
            userId
            scheduleId
            practicalId
            exerciseId
            locRank
            type
            rank
            count
            solutions
            descriptions
          }
        }
      }`,
      variables: {
        userId: state.accounts.userId
      },
    }
  };
};

export const mapStateToProps = (context: IContext, state: IState, ownProps: IProps): IComponentProps => ({
  context,
  filter: state.schedule.filter
});

export const mapDispatchToProps = (context: IContext, dispatch: any): IComponentActions => ({
  create(name: string) {
    // TODO: create!
  },
  handleSearch(filter: string) {
    dispatch(actions.handleSearch(filter));
  },
});

export default connect<IProps>({ mapQueriesToProps, mapStateToProps, mapDispatchToProps })(loadingContainer(Component));
