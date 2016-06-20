// here we import all reducers from modules
// this is the root for all reducers so that we can hot reload them

import apolloClient from './apollo';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { reducer as accountsReducer } from 'meteor/tomi:accountsui-semanticui-redux';

// import all other reducers

const rootReducer = combineReducers({
  accounts: accountsReducer,
  routing: routerReducer,
  form: formReducer,
  apollo: apolloClient.reducer()
});

export default rootReducer;

// typescript types holding all action creators

declare global {
  export interface IActions {
    core: {
      check: Function;
    }
  }
}
