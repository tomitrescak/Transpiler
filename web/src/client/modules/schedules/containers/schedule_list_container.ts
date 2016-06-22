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

// export const composer: IKomposer = ({context, clearSearch, header, route, showBadges, icon}: IProps, onData: IKomposerData<IComponentProps>) => {
//   const { Sub, Collections, Models, LocalState }: IContext = context();
//   if (Sub.subscribe('schedules').ready()) {
//     const options = {
//       reactive: false,
//       sort: {startDate: -1}
//     };
//
//     const searchText = LocalState.get(LocalState.keys.Search);
//
//     let reg = searchText ? new RegExp('.*' + searchText + '.*', 'i') : /.*/;
//     let data = Collections.Schedules.find({ name: { $regex: reg } }, options).fetch();
//
//     // build all schedules
//
//     const componentData = {
//       header,
//       route,
//       showBadges,
//       icon,
//       isAdmin: Models.Security.isAdmin(Meteor.userId()),
//       schedules: data
//     };
//     onData(null, componentData);
//   } else {
//     onData();
//   }
//   return clearSearch;
// };

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

  },
  clearSearch() {
    dispatch(actions.clearSearch());
  },
  handleSearch(filter: string) {
    dispatch(actions.handleSearch(filter));
  },
})

export default connect({ mapQueriesToProps, mapStateToProps, mapDispatchToProps })(loadingContainer(Component));
