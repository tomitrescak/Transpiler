import Component, { IComponentProps, IComponentQuery, IComponentActions } from '../components/practical_view';
import { connect, loadingContainer } from 'meteor/tomi:apollo-mantra';
import * as practicalActions from '../actions/practical_actions';
import * as userActions from '../../user/configs/user_actions';

interface IProps {
  params: {
    scheduleId: string;
    practicalId: string;
  }
}

const mapQueriesToProps = (context: IContext, { state, ownProps }: IGraphQlProps<IProps>): IComponentQuery => {
  return {
    secretData: {
      query: gql`
        query userSecret {
          userSecret
        }`
    },
    practicalData: {
      query: gql`
      query practical($practicalId: String, $scheduleId: String, $userId: String) {
        practical(practicalId: $practicalId, scheduleId: $scheduleId, userId: $userId) {
          _id,
          name,
          description,
          exercises {
            _id
            name
            description
            points
          }
          permissions {
            owner
            ownerAccess
            otherAccess
          }
        }
      }`,
      variables: {
        practicalId: ownProps.params.practicalId,
        scheduleId: ownProps.params.scheduleId,
        userId: state.accounts.userId
      },
    },
    scheduleData: {
      query: gql`
      query schedule($id: String, $userId: String) {
        schedule(id: $id, userId: $userId) {
          _id
          name
          items {
            from
            due
            practicalId
            name
          }
          tutors {
            id,
            name,
            email
          }
        }
      }`,
      variables: {
        id: ownProps.params.scheduleId,
        userId: state.accounts.userId
      },
    }
  };
};

export const mapDispatchToProps = (context: IContext, dispatch: any): IComponentActions => ({
  createPractical() {
    // TODO: create!
  },
  handleSearch(filter: string) {
    dispatch(practicalActions.handleSearch(filter));
  },
});

export const mapStateToProps = (context: IContext, state: IState, ownProps: IProps): IComponentProps => ({
  context,
  user: state.accounts.user,
  filter: state.practical.filter
});

export default connect({ mapQueriesToProps, mapStateToProps, mapDispatchToProps })(loadingContainer(Component, ['scheduleData', 'practicalData', 'secretData']));


// export const composer: IKomposer = ({context, scheduleId, practicalId}: IProps, onData: IKomposerData<IComponentProps>) => {
//   const { Sub, Collections, LocalState }: IContext = context();
//
//   let handle1 = Sub.subscribe("schedule", scheduleId);
//   let handle2 = Sub.subscribe("practicalAndSolutions", scheduleId, practicalId);
//   // let handle3 = Sub.subscribe("rankings", scheduleId, practicalId);
//
//   if (handle1.ready() && handle2.ready()) { // && handle3.ready()) {
//     const searchText = LocalState.get(LocalState.keys.Search);
//     const options = { reactive: false, sort: {name: 1} };
//
//     let reg = searchText ? new RegExp(".*" + searchText + ".*", "i") : /.*/;
//     let practical = Collections.Practicals.findOne(practicalId, { reactive: false });
//     let exercises = Collections.Exercises.find({ _id: { $in: practical.exercises }, name: { $regex: reg } }, options).fetch();
//
//     onData(null, {
//       practical: practical,
//       exercises: exercises,
//       solutions: Collections.Solutions.find({ createdById: Meteor.userId(), scheduleId: scheduleId, practicalId: practicalId }, { reactive: false }).fetch(),
//       schedule: Collections.Schedules.findOne(scheduleId, { reactive: false })
//     });
//   } else {
//     onData();
//   }
//
//   return null;
// };
//
// export const depsMapper = (context: IContext, actions: { practicals: IComponentActions }): IComponentActions => ({
//   createExercise: actions.practicals.createExercise,
//   zipPath: actions.practicals.zipPath,
//   resultsPath: actions.practicals.resultsPath,
//   handleSearch: actions.practicals.handleSearch,
//   context: () => context
// });
//
// export default composeAll<IProps>(
//   composeWithTracker(composer, Loading),
//   useDeps(depsMapper)
// )(Component);
