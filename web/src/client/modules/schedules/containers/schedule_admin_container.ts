import { useDeps, composeWithTracker, composeAll } from "mantra-core";
import Component, { IComponentProps, IComponentActions, IComponent } from "../components/schedule_admin_view";
import Loading from "../../core/components/loading_view";

interface IProps {
  context?: () => IContext;
  scheduleId: string;
}

function sendData(schedule: ISchedule, context: () => IContext, onData: IKomposerData<IComponentProps>) {
  let data = {
    schedule,
    practicals: schedule.items,
    tutors: schedule.tutors,
    context: context
  };
  onData(null, data);
}

export const composer: IKomposer = ({context, scheduleId}: IProps, onData: IKomposerData<IComponent>) => {
  const { Sub, Models, Collections, Objects }: IContext = context();

  let schedule = Objects.Schedule;
  if (schedule && schedule._id === scheduleId) {
    sendData(schedule, context, onData);
    return;
  }

  let handleS = Sub.subscribe("schedule", scheduleId);
  let handleT = Sub.subscribe("sites");
  let handleP = Sub.subscribe("practicals");

  if (handleS.ready() && handleT.ready() && handleP.ready()) {
    schedule = new Models.Schedule(Collections.Schedules.findOne(scheduleId, { reactive: false }));
    Objects.Schedule = schedule;

    sendData(schedule, context, onData);
  } else {
    onData();
  }

  return null;
};

export const depsMapper = (context: IContext, actions: { schedule_admin: IComponentActions}): IComponentActions => ({
  addPractical: actions.schedule_admin.addPractical,
  addTutor: actions.schedule_admin.addTutor,
  delete: actions.schedule_admin.delete,
  deletePractical: actions.schedule_admin.deletePractical,
  deleteTutor: actions.schedule_admin.deleteTutor,
  duplicate: actions.schedule_admin.duplicate,
  context: () => context
});

export default composeAll<IProps>(
  composeWithTracker(composer, Loading, null, { pure: false }),
  useDeps(depsMapper)
)(Component);
