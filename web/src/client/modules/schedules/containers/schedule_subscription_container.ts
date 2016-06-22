import { useDeps, composeWithTracker, composeAll } from "mantra-core";
import Component, { IComponentProps, IComponentActions, IComponent } from "../components/schedule_subscription_view";

import Loading from "../../core/components/loading_view";
import actions from '../actions/schedule_subscription_actions';
import { connect, loadingContainer } from 'meteor/tomi:apollo-mantra';

interface IProps {
  tutors: IScheduleTutorDAO[];
  scheduleId: string;
}

// export const composer: IKomposer = ({context, tutors, scheduleId, subscribe, unsubscribe}: IProps, onData: IKomposerData<IComponentProps>) => {
//   const { LocalState, User }: IContext = context();
//   const subscription = User.info().getScheduleSubscription(scheduleId);
//   const data = {
//     subscription,
//     scheduleId,
//     tutors
//   };
//
//   onData(null, data);
//   return null;
// };
//
// export const depsMapper = (context: IContext, actions: { scheduleSubscription: IComponentActions}): IComponentActions => ({
//   subscribe: actions.scheduleSubscription.subscribe,
//   unsubscribe: actions.scheduleSubscription.unsubscribe,
//   context: () => context
// });
//
// export default composeAll<IProps>(
//   composeWithTracker(composer, Loading),
//   useDeps(depsMapper)
// )(Component);

export const mapStateToProps = (context: IContext, state: IState, ownProps: IProps): IComponentProps => ({
  context,
  user: state.accounts.user,
  subscription: state.accounts.user && state.accounts.user.profile.schedules ?
    state.accounts.user.profile.schedules.find((f) => f.scheduleId === ownProps.scheduleId) :
    null
});

export const mapDispatchToProps = (context: IContext, dispatch: any, ownProps: IProps): IComponentActions => ({
  subscribe(tutorId: string, tutorName: string) {
    dispatch(actions.subscribe(ownProps.scheduleId, tutorId, tutorName));
  },
  unsubscribe() {
    dispatch(actions.unsubscribe(ownProps.scheduleId));
  }
});

export default connect({ mapDispatchToProps, mapStateToProps })(Component);
