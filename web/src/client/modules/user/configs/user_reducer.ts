import { Meteor } from 'meteor/meteor';
import { AccountsUiUser, reducer as accountsReducer } from 'meteor/tomi:accountsui-semanticui-redux';
import { SUBSCRIBE, UNSUBSCRIBE, IActionSubscribe, IActionUnSubscribe } from '../../schedules/actions/schedule_subscription_actions';
import { SECRET } from './user_actions';
import { IState as IAccountsState } from 'meteor/tomi:accountsui-semanticui-redux';
import Permissions from '../../../../lib/models/permission_model';

declare global {
  interface IScheduleSubscription {
    scheduleId: string;
    tutorId: string;
    tutorName: string;
  }
  interface SystemUser extends AccountsUiUser {
    avatar: string;
    secret: string;
    profile: {
      schedules: IScheduleSubscription[]
    },
    subscribe(state: IAccountsState<SystemUser>, action: IActionSubscribe): void;
    unsubscribe(state: IAccountsState<SystemUser>, action: IActionUnSubscribe): void;
    canRead(permissions: IPermissionsDAO): boolean;
    canWrite(permissions: IPermissionsDAO): boolean;
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
      subscriptions = action.subscriptions;
      return modifyProfile(user, state, { schedules: subscriptions });
    },
    unsubscribe(state: IState, action: IActionSubscribe) {
      // filter out subscriptions
      const subscriptions = action.subscriptions;
      return modifyProfile(user, state, { schedules: subscriptions  });
    },
    canRead(permissions: IPermission) {
      return Permissions.canRead(permissions, user);
    },
    canWrite(permissions: IPermission) {
      return Permissions.canWrite(permissions, user);
    }
  };
};

export function reducer(state: IAccountsState<SystemUser>, action: IReduxAction) {
  // augument user with system specific properties
  if (action.type === 'ACCOUNTS: Assign User') {
    action['user'] = Object.assign(action['user'], augmentation(action['user']));
  }

  switch (action.type) {
    case SECRET:
      return Object.assign({}, state, { secret: action['secret'] })
    case SUBSCRIBE:
      return state.user.subscribe(state, <IActionSubscribe> action);
    case UNSUBSCRIBE:
      return state.user.unsubscribe(state, <IActionUnSubscribe> action);
    default:
      return accountsReducer(state, action);
  }
}