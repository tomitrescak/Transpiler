import Component, { IComponentProps, IComponentActions, EXERCISE_EDITOR } from '../components/exercise_view';
import { CenteredLoading } from '../../core/components/loading_view';
import queries from '../../../helpers/queries_helper';
import { connect, compose, composeAll, loadingContainer, queriesFinished } from 'meteor/tomi:apollo-mantra';
import * as actions from '../actions/solution_actions';
import { Random } from 'meteor/random';
import editorActions from '../../text_editor/actions/text_editor_actions';

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

function getFiles(owners: IFileOwner[]) {
  let files: ITextFileDAO[] = [];
  //try {
    // merge files in priority order, from solution up

    for (let owner of owners) {
      if (!owner || !owner.files) {
        continue;
      }

      for (let file of owner.files) {
        if (!files.find((f) => f.name === file.name)) {
          // make sure they are properly marked
          if (file.type !== 'userCode') {
            file.readonly = true;
          }
          files.push(file);
        }
      }
    }
  // }
  // catch (ex) {
  //   console.log(ex.trace)
  // }
  return files;
}

function findSolution(context: IContext, ownProps: IProps, onData: Function): any {
  const state = context.Store.getState();

  // wait till everything is loaded
  if (!queriesFinished(state.apollo)) {
    onData();
    return;
  }

  let solution = context.Utils.Class.find<ISolutionDAO>(
    state.solution.solutions, (s) =>
      s.scheduleId === ownProps.params.scheduleId &&
      s.practicalId === ownProps.params.practicalId &&
      s.exerciseId === ownProps.params.exerciseId);

  const exercise = state.exercise.exercises[ownProps.params.exerciseId];
  const practical = state.practical.practicals[ownProps.params.practicalId];
  const schedule = state.schedule.schedules[ownProps.params.scheduleId];
  const world = state.world.worlds[exercise.worldId];

  // in case there is no solution, we create a new solution

  if (!solution) {
    const subscription = state.accounts.user.getSubscription(schedule._id);
    let filteredFiles = getFiles([exercise, practical, schedule, world]).filter((w) => w.type === 'userCode');

    solution = {
      _id: Random.id(),
      scheduleId: schedule._id,
      practicalId: practical._id,
      exerciseId: exercise._id,
      files: filteredFiles,
      tutorId: subscription ? subscription.tutorId : null,
      tutorName: subscription ? subscription.tutorName : null
    };

    // Schifezza: I need to modify the store directly as dispatch wreaks havoc
    context.Store.dispatch(actions.createSolution(solution));
    // state.solution.solutions[solution._id] = solution;
  }

  let files = getFiles([solution, exercise, practical, schedule, world]);

  // init file actions
  const fileActions = editorActions(EXERCISE_EDITOR, context.Store);

  // dispatch action that initialises editorOptions
  const editor = context.Store.getState().editor.editors[EXERCISE_EDITOR];
  if (!editor || editor.ownerId !== solution._id) {
    fileActions.init(files, solution._id, false);
  }

  onData(null, {
    context,
    user: state.accounts.user,
    solution,
    files,
    schedule,
    practical,
    exercise,
    world: state.world.worlds[exercise.worldId],
    fileActions,
  });
}

// export const mapStateToProps = (context: IContext, state: IState, ownProps: IProps): IComponentProps => {
// // wait till everything is loaded
// if (!queriesFinished(state.apollo)) {
//   return {} as any;
// }
//
// let solution = context.Utils.Class.find<ISolutionDAO>(
//   state.solution.solutions, (s) =>
//     s.scheduleId === ownProps.params.scheduleId &&
//     s.practicalId === ownProps.params.practicalId &&
//     s.exerciseId === ownProps.params.exerciseId);
//
// const exercise = state.exercise.exercises[ownProps.params.exerciseId];
// const practical = state.practical.practicals[ownProps.params.practicalId];
// const schedule = state.schedule.schedules[ownProps.params.scheduleId];
// const world = state.world.worlds[exercise.worldId];
//
// // in case there is no solution, we create a new solution
//
// if (!solution) {
//   const subscription = state.accounts.user.getSubscription(schedule._id);
//   let filteredFiles = getFiles([exercise, practical, schedule, world]).filter((w) => w.type !== 'library');
//
//   solution = {
//     _id: Random.id(),
//     scheduleId: schedule._id,
//     practicalId: practical._id,
//     exerciseId: exercise._id,
//     files: filteredFiles,
//     tutorId: subscription ? subscription.tutorId : null,
//     tutorName: subscription ? subscription.tutorName : null
//   };
//
//   // Schifezza: I need to modify the store directly as dispatch wreaks havoc
//   // context.Store.dispatch(actions.createSolution(solution));
//   state.solution.solutions[solution._id] = solution;
// }
//
// let files = getFiles([solution, exercise, practical, schedule, world]);
//
// return {
//   context,
//   user: state.accounts.user,
//   solution,
//   files,
//   schedule,
//   practical,
//   exercise,
//   world: state.world.worlds[exercise.worldId]
// };
// };

// export const mapDispatchToProps = (context: IContext, dispatch: Function, ownProps: IProps): IComponentActions => {
//   return {
//   };
// };

function checkPractical() {
  console.log('doing');
}

export default composeAll(
  //connect({ mapQueriesToProps, mapStateToProps }),
  compose(findSolution),
  connect({ mapQueriesToProps })
)(loadingContainer(Component, CenteredLoading, ['scheduleData', 'practicalData', 'exerciseData', 'solutionData', 'worldData']));

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
