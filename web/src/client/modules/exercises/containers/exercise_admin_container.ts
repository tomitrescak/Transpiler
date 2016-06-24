import { useDeps, compose, composeAll } from "mantra-core";

import Component, { IComponentProps } from "../components/exercise_admin_view";
import Loading from "../../core/components/loading_view";

interface IProps {
  context?: () => IContext;
  exerciseId: string;
}

function sendData(exercise: IExercise, context: () => IContext, onData: IKomposerData<IComponentProps>) {
  let data = {
    exercise,
    context: context
  };
  onData(null, data);
}

export const composer: IKomposer = ({context, exerciseId}: IProps, onData: IKomposerData<IComponentProps>) => {
  const { Sub, Collections, Objects, Models }: IContext = context();

  let exercise = Objects.Exercise;

  if (exercise && exercise._id === exerciseId) {
    sendData(exercise, context, onData);
    return;
  }

  const handleW = Sub.subscribe("worlds");
  const handleE = Sub.subscribe("exercise", exerciseId);
  const handleS = Sub.subscribe("sites");

  if (handleW.ready() && handleE.ready() && handleS.ready()) {
    exercise = new Models.Exercise(Collections.Exercises.findOne(exerciseId, { reactive: false }));
    Objects.Exercise = exercise;

    sendData(exercise, context, onData);
  } else {
    onData();
  }

  return () => {
      Objects.Exercise = null;
  };
};

// export const depsMapper = (context: IContext, actions: { schedule_admin: IComponentActions}): IComponentActions => ({
//   addPractical: actions.schedule_admin.addPractical,
//   addTutor: actions.schedule_admin.addTutor,
//   delete: actions.schedule_admin.delete,
//   deletePractical: actions.schedule_admin.deletePractical,
//   deleteTutor: actions.schedule_admin.deleteTutor,
//   duplicate: actions.schedule_admin.duplicate,
//   context: () => context
// });

export default composeAll<IProps>(
  compose(composer, Loading, null, { pure: false }),
  useDeps()
)(Component);
