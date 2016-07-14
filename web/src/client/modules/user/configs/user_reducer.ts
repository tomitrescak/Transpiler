import { Meteor } from 'meteor/meteor';
import { AccountsUiUser, reducer as accountsReducer } from 'meteor/tomi:accountsui-semanticui-redux';
import { SUBSCRIBE, UNSUBSCRIBE, IActionSubscribe, IActionUnSubscribe } from '../../schedules/actions/schedule_subscription_actions';
import { SECRET } from './user_actions';
import { IState as IAccountsState } from 'meteor/tomi:accountsui-semanticui-redux';
import Permissions from '../../../../lib/models/permission_model';
import store from '../../../configs/store';

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
      schedules: IScheduleSubscription[],
      avatar: string,
      name: string
    };
    getSubscription(scheduleId: string): IScheduleSubscription;
    subscribe(state: IAccountsState<SystemUser>, action: IActionSubscribe): void;
    unsubscribe(state: IAccountsState<SystemUser>, action: IActionUnSubscribe): void;
    canRead(permissions: IPermissionsDAO): boolean;
    canWrite(permissions: IPermissionsDAO): boolean;
  }
}

function modifyProfile(user: Meteor.User, state: IAccountsState<SystemUser>, modification: Object) {
  // change profile
  const profile = Object.assign({}, user.profile, modification);
  // change user
  user = Object.assign({}, user, { profile });
  // change state
  return Object.assign({}, state, { user });
}

const augmentation = function(defaultUser: Meteor.User) {
  return {
    get avatar() {
      const user = store.getState().accounts.user;
      return user && user.profile && user.profile.avatar ? user.profile.avatar : 'clara.png';
    },
    getSubscription(scheduleId: string) {
      const user = store.getState().accounts.user;
      let subscriptions: IScheduleSubscription[] = user.profile.schedules;
      if (!subscriptions) {
        return null;
      }
      return subscriptions.find((s) => s.scheduleId === scheduleId);
    },
    subscribe(state: IState, action: any) {
      const user = store.getState().accounts.user;
      let subscriptions = user.profile.schedules;
      if (!subscriptions) {
        subscriptions = [];
      }
      // add the subscriptions
      subscriptions = action.subscriptions;
      return modifyProfile(user, state, { schedules: subscriptions });
    },
    unsubscribe(state: IState, action: any) {
      const user = store.getState().accounts.user;
      // filter out subscriptions
      const subscriptions = action.subscriptions;
      return modifyProfile(user, state, { schedules: subscriptions  });
    },
    canRead(permissions: IPermission) {
      return Permissions.canRead(permissions, defaultUser);
    },
    canWrite(permissions: IPermission) {
      return Permissions.canWrite(permissions, defaultUser);
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
      return Object.assign({}, state, { secret: action['secret'] });
    case SUBSCRIBE:
      return state.user.subscribe(state, <IActionSubscribe> action);
    case UNSUBSCRIBE:
      return state.user.unsubscribe(state, <IActionUnSubscribe> action);
    default:
      return accountsReducer(state, action);
  }
}
