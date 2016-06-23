import { useDeps, composeWithTracker, composeAll } from "mantra-core";
import Component, { IComponentProps } from "../components/leaderboards_schedule_view";

import Loading from "../../core/components/loading_view";

interface IProps {
  context?: () => IContext;
  scheduleId: string;
}

export const composer: IKomposer = ({context, scheduleId}: IProps, onData: IKomposerData<IComponentProps>) => {
  let { Sub, Collections } = context();


  let shandle = Sub.subscribe("schedule", scheduleId);
  let hhandle = Sub.subscribe("scheduledPracticals", scheduleId);
  let rhandle = Sub.subscribe("leaderboards", scheduleId, null, null);

  if (shandle.ready() && hhandle.ready() && rhandle.ready()) {
    let schedule = Collections.Schedules.findOne(scheduleId, { reactive: false });
    let ids = schedule.items.map((doc: IScheduleItemDAO) => { return doc.practicalId; });

    onData(null, {
      context: context,
      schedule: schedule,
      practicals: Collections.Practicals.find({ _id: { $in: ids } }, { sort: { name: 1}, reactive: false }).fetch(),
      results: Collections.Results.find({scheduleId: scheduleId, practicalId: null}, { reactive: false }).fetch()
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
