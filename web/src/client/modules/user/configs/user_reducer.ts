import { Meteor } from 'meteor/meteor';
import { AccountsUiUser, reducer as accountsReducer } from 'meteor/tomi:accountsui-semanticui-redux';
import { SUBSCRIBE, UNSUBSCRIBE, IActionSubscribe, IActionUnSubscribe } from '../../schedules/actions/schedule_subscription_actions';
declare global {
  interface IScheduleSubscription {
    scheduleId: string;
    tutorId: string;
    tutorName: string;
  }
  interface SystemUser extends AccountsUiUser {
    avatar: string;
    profile: {
      schedules: IScheduleSubscription[]
    },
    subscribe(action: IActionSubscribe): void;
    unsubscribe(action: IActionUnSubscribe): void;
  }
}

function modifyProfile(user: Meteor.User, state: IState, modification: Object) {
  // change profile
  const profile = Object.assign({}, user.profile, modification);
  // change user
  user = Object.assign({}, user, { profile });
  // change state
  return Object.assign({}, state, { user });
}

const augmentation = function(user: Meteor.User) {
  console.log('Augmenting user ...');
  return {
    get avatar() {
      return user.profile && user.profile.avatar ? user.profile.avatar : 'clara.png';
    },
    subscribe(state: IState, action: IActionSubscribe) {
      let subscriptions = user.profile.subscriptions;
      if (!subscriptions) {
        subscriptions = [];
      }
      // add the subscriptions
      subscriptions = subscriptions.concat({ scheduleId: action.scheduleId, tutorId: action.tutorId, tutorName: action.tutorName });
      modifyProfile(user, state, { subscriptions });
    },
    unsubscribe(state: IState, action: IActionSubscribe) {
      // filter out subscriptions
      const subscriptions = user.profile.subscriptions.filter((s: any) => s.scheduleId !== action.scheduleId);
      modifyProfile(user, state, { subscriptions });
    }
  };
};

export function reducer(state: IState, action: IReduxAction) {
  // augument user with system specific properties
  if (action.type === 'ACCOUNTS: Assign User') {
    action['user'] = Object.assign(action['user'], augmentation(action['user']));
  }

  switch (action.type) {
    case SUBSCRIBE:
      state.accounts.user.subscribe(<IActionSubscribe> action);
      break;
    case UNSUBSCRIBE:
      state.accounts.user.unsubscribe(<IActionUnSubscribe> action);
      break;
    default:
      return accountsReducer(state, action);
  }
}
