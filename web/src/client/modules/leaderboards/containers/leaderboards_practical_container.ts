import { useDeps, composeWithTracker, composeAll } from "mantra-core";
import Component, { IComponentProps } from "../components/leaderboards_practical_view";
import Loading from "../../core/components/loading_view";

interface IProps {
  context?: () => IContext;
  scheduleId: string;
  practicalId: string;
}

export const composer: IKomposer = ({context, scheduleId, practicalId}: IProps, onData: IKomposerData<IComponentProps>) => {
  let { Sub, Collections } = context();


  let shandle = Sub.subscribe("schedule", scheduleId);
  let hhandle = Sub.subscribe("practicalAndExercises", scheduleId, practicalId);
  let rhandle = Sub.subscribe("leaderboards", scheduleId, practicalId, null);


  if (shandle.ready() && hhandle.ready() && rhandle.ready()) {
    let practical = Collections.Practicals.findOne(practicalId, { reactive: false });
    onData(null, {
      context: context,
      schedule: Collections.Schedules.findOne(scheduleId, { reactive: false }),
      practical: practical,
      exercises: Collections.Exercises.find({ _id: { $in: practical.exercises } }, { sort: { name: 1}, reactive: false }).fetch(),
      results: Collections.Results.find({scheduleId: scheduleId, practicalId: practicalId, exerciseId: null}, { reactive: false }).fetch()
    });
  } else {
    onData();
  }

  return null;
};

export default composeAll<IProps>(
  composeWithTracker(composer, Loading),
  useDeps()
)(Component);
