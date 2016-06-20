import { useDeps, composeWithTracker, composeAll } from "mantra-core";
import Component, { IComponentProps } from "../components/schedule_view";

import Loading from "../../core/components/loading_view";

interface IProps {
  context?: () => IContext;
  scheduleId: string;
}

export const composer: IKomposer = ({context, scheduleId}: IProps, onData: IKomposerData<IComponentProps>) => {
  const { Sub, Utils, Collections, User }: IContext = context();

  let handle1 = Sub.subscribe("schedule", scheduleId);
  let handle2 = Sub.subscribe("scheduledPracticals", Utils.Router.getParam("_id"));

  if (handle1.ready() && handle2.ready()) {
    let schedule = Collections.Schedules.findOne(scheduleId, { reactive: false });
    // figure out which items are visible

    let visibleItems: IScheduleItemDAO[] = [];
    let date = new Date();
    let item: IScheduleItemDAO;

    if (User.info().playsRoles(["admin", "tutor"])) {
      visibleItems = schedule.items;
    } else {
      visibleItems = schedule.items.filter((doc: IScheduleItemDAO) => { return doc.from == null || doc.from < date; });
    }

    let data: IComponentProps = {
      schedule,
      visibleItems,
      context
    };
    onData(null, data);
  } else {
    onData();
  }
  return null;
};


export default composeAll<IProps>(
  composeWithTracker(composer, Loading),
  useDeps()
)(Component);
