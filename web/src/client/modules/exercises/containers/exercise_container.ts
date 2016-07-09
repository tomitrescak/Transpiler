import Component, { IComponentProps, IComponentActions } from '../components/exercise_view';
import { CenteredLoading } from '../../core/components/loading_view';
import queries from '../../../helpers/queries_helper';
import { connect, loadingContainer } from 'meteor/tomi:apollo-mantra';

interface IProps {
  params: {
    exerciseId?: string;
    practicalId?: string;
    scheduleId?: string;
  };
  background?: string;
  userId?: string;
}

const mapQueriesToProps = (context: IContext, { state, ownProps }: IGraphQlProps<IProps>): IGraphqlQuery => {
  return {
    scheduleData: {
      query: queries.schedule,
      variables: {
        id: ownProps.params.scheduleId,
        userId: state.accounts.userId
      },
    },
    practicalData: {
      query: queries.practical,
      variables: {
        id: ownProps.params.practicalId,
        userId: state.accounts.userId
      },
    },
    exerciseData: {
      query: queries.exercise,
      variables: {
        id: ownProps.params.exerciseId,
        userId: state.accounts.userId
      },
    },
    worldData: {
      query: queries.worlds
    },
    solutionData: {
      query: queries.solution,
      variables: {
        scheduleId: ownProps.params.scheduleId,
        practicalId: ownProps.params.practicalId,
        exerciseId: ownProps.params.exerciseId,
        userId: state.accounts.userId
      },
    }
  };
};

export const mapStateToProps = (context: IContext, state: IState, ownProps: IProps): IComponentProps => ({
  context,
  user: state.accounts.user,
  solution: context.Utils.Class.find<ISolutionDAO>(
    state.solution.solutions, (s) =>
      s.scheduleId === ownProps.params.scheduleId &&
      s.practicalId === ownProps.params.practicalId &&
      s.exerciseId === ownProps.params.exerciseId)
});

export const mapDispatchToProps = (context: IContext, dispatch: any): IComponentActions => ({
  // createPractical() {
  //   // TODO: create!
  // },
  // handleSearch(filter: string) {
  //   dispatch(practicalActions.handleSearch(filter));
  // },
});

export default connect({ mapQueriesToProps, mapStateToProps, mapDispatchToProps })
  (loadingContainer(Component, CenteredLoading, ['scheduleData', 'practicalData', 'exerciseData', 'solutionData', 'worldData']));

// export default composeAll<IProps>(
//   composeWithTracker(composer, CenteredLoading),
//   useDeps()
// )(Component);
//
// function createData(context: () => IContext, scheduleId: string, practicalId: string, exerciseId: string, userId: string, background: string): IComponentProps {
//   const { Collections, Models} = context();
//
//   // TODO: Solve this shit!
//   let schedule = new Models.Schedule(Collections.Schedules.findOne(scheduleId, { reactive: false }));
//   let practical = new Models.Practical(Collections, Collections.Practicals.findOne(practicalId, { reactive: false }));
//   let exercise = new Models.Exercise(Collections.Exercises.findOne(exerciseId, { reactive: false }));
//
//   let solutionDAO = Collections.Solutions.findOne({
//     scheduleId: scheduleId,
//     practicalId: practicalId,
//     exerciseId: exerciseId,
//     createdById: userId ? userId : Meteor.userId()
//   }, { reactive: false });
//
//   let solution = new Models.Solution(Collections, solutionDAO);
//   if (!solutionDAO) {
//     // init the solution from files in case we are initialising an first solution
//     solution.initFromObjects(schedule, practical, exercise);
//   }
//
//   // init tutor
//   if (solution.schedule.tutors.length > 0 && Meteor.user()) {
//     let scheduleSubscription = context().User.info().getScheduleSubscription(solution.schedule._id);
//     if (scheduleSubscription) {
//       solution.tutorId = scheduleSubscription.tutorId;
//       solution.tutorName = scheduleSubscription.tutorName;
//     } else {
//       context().Utils.Ui.alertDialog('error.notSubscribed', 'error');
//       // // subscribe to the first tutor
//       // let tutor = this._schedule.tutors[0];
//       // UserOptions.subscribe(this._schedule._id, tutor.id, tutor.name, callback);
//       // //  UiUtils.announce("Assigned tutor: " + tutor.name, 'Subscription error'));
//       // this._tutorId = tutor.id;
//       // this._tutorName = tutor.name;
//       // throw new Meteor.Error('subscription.required');
//       //
//       throw "You cannot save without user subscription!";
//     }
//   }
//
//   return {
//     context: context,
//     solution: solution,
//     background,
//     markingMode: false
//   };
// };
