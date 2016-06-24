import { useDeps, composeWithTracker, composeAll } from "mantra-core";
import Component, { IComponentProps, IComponentActions, IComponent } from "../components/practical_admin_view";
import Practical from "../../../models/practical_model";
import Loading from "../../core/components/loading_view";

interface IProps {
  context?: IContext;
  practicalId: string;
}

function sendData(practical: Practical, context: IContext, onData: IKomposerData<IComponentProps>) {
  let data = {
    practical
    // practicals: schedule.items,
    // tutors: schedule.tutors,
    // context: context,
    // textEditor: schedule.textEditor
  };
  onData(null, data);
}

export const composer: IKomposer = ({context, practicalId}: IProps, onData: IKomposerData<IComponent>) => {
  const { Sub, Collections, Objects }: IContext = context;

  let practical = <Practical> Objects.Practical;

  if (practical) {
    sendData(practical, context, onData);
    return;
  }

  const handle1 = Sub.subscribe("schedules");
  const handle2 = Sub.subscribe("practical", practicalId);
  const handle3 = Sub.subscribe("exerciseSearch");
  const handle4 = Sub.subscribe("sites");

  if (handle1.ready() && handle2.ready() && handle3.ready() && handle4.ready()) {
    const options = { reactive: false };
    practical = new Practical(context.Collections, Collections.Practicals.findOne(practicalId, options));
    Objects.Practical = practical;

    sendData(practical, context, onData);
  } else {
    onData();
  }

  return () => {
    Objects.Practical = null;
  };
};

export const depsMapper = (context: IContext, actions: { practical_admin: IComponentActions}): IComponentActions => ({
  addExercise: actions.practical_admin.addExercise,
  delete: actions.practical_admin.delete,
  removeExercise: actions.practical_admin.removeExercise,
  duplicate: actions.practical_admin.duplicate,
  save: actions.practical_admin.save,
  context: context
});

export default composeAll<IProps>(
  composeWithTracker(composer, Loading, null, { pure: false }),
  useDeps(depsMapper)
)(Component);
