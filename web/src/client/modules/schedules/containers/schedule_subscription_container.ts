import { useDeps, composeWithTracker, composeAll } from "mantra-core";
import Component, { IComponentProps, IComponentActions, IComponent } from "../components/schedule_subscription_view";

import Loading from "../../core/components/loading_view";

interface IProps {
  context?: () => IContext;
  tutors: IScheduleTutorDAO[];
  scheduleId: string;
  subscribe?: (scheduleId: string, tutorId: string) => void;
  unsubscribe?: (scheduleId: string) => void;
}

export const composer: IKomposer = ({context, tutors, scheduleId, subscribe, unsubscribe}: IProps, onData: IKomposerData<IComponentProps>) => {
  const { LocalState, User }: IContext = context();
  const subscription = User.info().getScheduleSubscription(scheduleId);
  const data = {
    subscription,
    scheduleId,
    tutors
  };

  onData(null, data);
  return null;
};

export const depsMapper = (context: IContext, actions: { scheduleSubscription: IComponentActions}): IComponentActions => ({
  subscribe: actions.scheduleSubscription.subscribe,
  unsubscribe: actions.scheduleSubscription.unsubscribe,
  context: () => context
});

export default composeAll<IProps>(
  composeWithTracker(composer, Loading),
  useDeps(depsMapper)
)(Component);
