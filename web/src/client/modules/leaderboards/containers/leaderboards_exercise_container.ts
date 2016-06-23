import { useDeps, composeWithTracker, composeAll } from "mantra-core";
import Component, { IComponentProps } from "../components/leaderboards_exercise_view";
import Loading from "../../core/components/loading_view";

interface IProps {
  context?: () => IContext;
  scheduleId: string;
  practicalId: string;
  exerciseId: string;
}

export const composer: IKomposer = ({context, scheduleId, practicalId, exerciseId}: IProps, onData: IKomposerData<IComponentProps>) => {
  const { Sub, Collections, Utils } = context();


  const shandle = Sub.subscribe("schedule", scheduleId);
  const hhandle = Sub.subscribe("practicalAndExercises", scheduleId, practicalId);
  const rhandle = Sub.subscribe("leaderboards", scheduleId, practicalId, exerciseId);

  if (shandle.ready() && hhandle.ready() && rhandle.ready()) {
    const schedule = Collections.Schedules.findOne(scheduleId, { reactive: false });
    const practical = Collections.Practicals.findOne(practicalId, { reactive: false });
    const exercise = Collections.Exercises.findOne(exerciseId, { reactive: false });

    if (!schedule || !practical || !exercise) {
      Utils.Router.go("prohibited");
    }

    onData(null, {
      context: context,
      schedule: schedule,
      practical: practical,
      exercise: exercise,
      results: Collections.Results.find({scheduleId: scheduleId, practicalId: practicalId, exerciseId: exerciseId}, { reactive: false }).fetch()
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
