import { useDeps, composeWithTracker, composeAll } from "mantra-core";
import Component, { IComponentProps } from "../components/exercise_view";
import { CenteredLoading } from "../../core/components/loading_view";

import { SubsManager } from "meteor/meteorhacks:subs-manager";
import { Meteor } from "meteor/meteor";

const subW = new SubsManager();
const subS = new SubsManager();
const subP = new SubsManager();
const subE = new SubsManager();

interface IProps {
  exerciseName?: string;
  practicalName?: string;
  scheduleName?: string;
  exerciseId?: string;
  practicalId?: string;
  scheduleId?: string;
  background?: string;
  userId?: string;
  context?: () => IContext;
}


export const composer: IKomposer = ({context, scheduleId, practicalId, exerciseId, scheduleName, practicalName, exerciseName, userId, background}: IProps, onData: IKomposerData<IComponentProps>) => {
  const { Meteor, Collections }: IContext = context();

  let worlds = subW.subscribe("worlds");

  if (exerciseName) {
    let handleS = subS.subscribe("scheduleByName", scheduleName);
    let handleE = subE.subscribe("exerciseByName", exerciseName);
    let handleP = subP.subscribe("practicalByName", practicalName);

    if (worlds.ready() && handleS.ready() && handleE.ready() && handleP.ready()) {
      // subscribe to exercise
      if (!scheduleId) {
        scheduleId = Collections.Schedules.findOne({ name: scheduleName })._id;
        practicalId = Collections.Practicals.findOne({ name: practicalName })._id;
        exerciseId = Collections.Exercises.findOne({ name: exerciseName })._id;
      }

      let handleSol = Meteor.subscribe("solution", scheduleId, practicalId, exerciseId);
      if (handleSol.ready()) {
        onData(null, createData(context, scheduleId, practicalId, exerciseId, null, background));
        return;
      }
    }
  } else {
    let handleS = Meteor.subscribe("schedule", scheduleId);
    let handleE = Meteor.subscribe("exercise", exerciseId);
    let handleP = Meteor.subscribe("practical", practicalId);
    let handleSol = Meteor.subscribe("solution", scheduleId, practicalId, exerciseId, userId);

    if (worlds.ready() && handleS.ready() && handleE.ready() && handleP.ready() && handleSol.ready()) {
      onData(null, createData(context, scheduleId, practicalId, exerciseId, userId, background));
      return;
    }
  }

  onData();

  return null;
};

export default composeAll<IProps>(
  composeWithTracker(composer, CenteredLoading),
  useDeps()
)(Component);

function createData(context: () => IContext, scheduleId: string, practicalId: string, exerciseId: string, userId: string, background: string): IComponentProps {
  const { Collections, Models} = context();

  // TODO: Solve this shit!
  let schedule = new Models.Schedule(Collections.Schedules.findOne(scheduleId, { reactive: false }));
  let practical = new Models.Practical(Collections, Collections.Practicals.findOne(practicalId, { reactive: false }));
  let exercise = new Models.Exercise(Collections.Exercises.findOne(exerciseId, { reactive: false }));

  let solutionDAO = Collections.Solutions.findOne({
    scheduleId: scheduleId,
    practicalId: practicalId,
    exerciseId: exerciseId,
    createdById: userId ? userId : Meteor.userId()
  }, { reactive: false });

  let solution = new Models.Solution(Collections, solutionDAO);
  if (!solutionDAO) {
    // init the solution from files in case we are initialising an first solution
    solution.initFromObjects(schedule, practical, exercise);
  }

  // init tutor
  if (solution.schedule.tutors.length > 0 && Meteor.user()) {
    let scheduleSubscription = context().User.info().getScheduleSubscription(solution.schedule._id);
    if (scheduleSubscription) {
      solution.tutorId = scheduleSubscription.tutorId;
      solution.tutorName = scheduleSubscription.tutorName;
    } else {
      context().Utils.Ui.alertDialog("error.notSubscribed", "error");
      // // subscribe to the first tutor
      // let tutor = this._schedule.tutors[0];
      // UserOptions.subscribe(this._schedule._id, tutor.id, tutor.name, callback);
      // //  UiUtils.announce("Assigned tutor: " + tutor.name, "Subscription error"));
      // this._tutorId = tutor.id;
      // this._tutorName = tutor.name;
      // throw new Meteor.Error("subscription.required");
      //
      throw "You cannot save without user subscription!";
    }
  }

  return {
    context: context,
    solution: solution,
    background,
    markingMode: false
  };
};
