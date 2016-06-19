import { AccountsUiUser, reducer as accountsReducer } from 'meteor/tomi:accountsui-semanticui-redux';

declare global {
  interface User extends AccountsUiUser {
    avatar: string;
  }
}

const augmentation = function (user: any) {
  return {
    get avatar() {
      return user.profile && user.profile.avatar ? user.profile.avatar : 'clara.png';
    }
  }
}

export default function(state: IState, action: any) {
  // augument user with system specific properties
  if (action.user) {
    action.user = Object.assign(action.user, augmentation(action.user));
  }

  // call original reducer
  return accountsReducer(state, action);
}
