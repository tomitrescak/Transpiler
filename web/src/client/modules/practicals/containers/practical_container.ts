import { useDeps, composeWithTracker, composeAll } from "mantra-core";
import Component, { IComponentProps, IComponentActions } from "../components/practical_view";
import Loading from "../../core/components/loading_view";

import { Meteor } from "meteor/meteor";

interface IProps {
  context?: () => IContext;
  scheduleId: string;
  practicalId: string;
}

export const composer: IKomposer = ({context, scheduleId, practicalId}: IProps, onData: IKomposerData<IComponentProps>) => {
  const { Sub, Collections, LocalState }: IContext = context();

  let handle1 = Sub.subscribe("schedule", scheduleId);
  let handle2 = Sub.subscribe("practicalAndSolutions", scheduleId, practicalId);
  // let handle3 = Sub.subscribe("rankings", scheduleId, practicalId);

  if (handle1.ready() && handle2.ready()) { // && handle3.ready()) {
    const searchText = LocalState.get(LocalState.keys.Search);
    const options = { reactive: false, sort: {name: 1} };

    let reg = searchText ? new RegExp(".*" + searchText + ".*", "i") : /.*/;
    let practical = Collections.Practicals.findOne(practicalId, { reactive: false });
    let exercises = Collections.Exercises.find({ _id: { $in: practical.exercises }, name: { $regex: reg } }, options).fetch();

    onData(null, {
      practical: practical,
      exercises: exercises,
      solutions: Collections.Solutions.find({ createdById: Meteor.userId(), scheduleId: scheduleId, practicalId: practicalId }, { reactive: false }).fetch(),
      schedule: Collections.Schedules.findOne(scheduleId, { reactive: false })
    });
  } else {
    onData();
  }

  return null;
};

export const depsMapper = (context: IContext, actions: { practicals: IComponentActions }): IComponentActions => ({
  createExercise: actions.practicals.createExercise,
  zipPath: actions.practicals.zipPath,
  resultsPath: actions.practicals.resultsPath,
  handleSearch: actions.practicals.handleSearch,
  context: () => context
});

export default composeAll<IProps>(
  composeWithTracker(composer, Loading),
  useDeps(depsMapper)
)(Component);
