// here we import all reducers from modules
// this is the root for all reducers so that we can hot reload them

import { client } from './apollo';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { reducer as accountsReducer } from 'meteor/tomi:accountsui-semanticui-redux';
import { marksReducer, markReducer } from '../modules/marking/containers/marking_reducer';

// import all other reducers

const rootReducer = combineReducers({
  accounts: accountsReducer,
  routing: routerReducer,
  form: formReducer,
  marks: marksReducer,
  mark: markReducer,
  apollo: client.reducer()
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
