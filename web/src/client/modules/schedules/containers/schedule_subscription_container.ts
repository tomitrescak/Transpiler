import Component, { IComponentProps, IComponentActions } from '../components/schedule_subscription_view';

import actions from '../actions/schedule_subscription_actions';
import { connect } from 'meteor/tomi:apollo-mantra';

interface IProps {
  tutors: IScheduleTutorDAO[];
  scheduleId: string;
}

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
