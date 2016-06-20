// here we import all reducers from modules
// this is the root for all reducers so that we can hot reload them

import apolloClient from './apollo';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { reducer as accountsReducer } from 'meteor/tomi:accountsui-semanticui-redux';
import { reducer as scheduleReducer, IScheduleState } from '../modules/schedules/actions/schedule_reducer';

import { IState as IAccountsState } from 'meteor/tomi:accountsui-semanticui-redux';
import { IStore as ReduxStore } from 'redux';

// import all other reducers

const rootReducer = combineReducers({
  accounts: accountsReducer,
  routing: routerReducer,
  form: formReducer,
  apollo: apolloClient.reducer(),
  schedule: scheduleReducer
});

export default rootReducer;

// typescript types holding all action creators

declare global {
  export interface IState {
    accounts: IAccountsState;
    schedule: IScheduleState
    // marks: IResult[];
    // mark: IResult;
  }

  export interface IStore extends ReduxStore<IState> {
  }

  export interface IActions {
    core: {
      check: Function;
    }
  }
}
