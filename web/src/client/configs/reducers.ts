// here we import all reducers from modules
// this is the root for all reducers so that we can hot reload them

import apolloClient from './apollo';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { reducer as accountsReducer } from '../modules/user/configs/user_reducer';
import { reducer as scheduleReducer, IScheduleState } from '../modules/schedules/actions/schedule_reducer';
import { reducer as practicalReducer, IPracticalState } from '../modules/practicals/actions/practical_reducer';
import { reducer as exerciseReducer, IExerciseState } from '../modules/exercises/actions/exercise_reducer';
import { reducer as solutionReducer, ISolutionState } from '../modules/exercises/actions/solution_reducer';
import { reducer as compilerReducer, ICompilerState } from '../modules/exercises/actions/compiler_reducer';


import { IState as IAccountsState } from 'meteor/tomi:accountsui-semanticui-redux';
import { IStore as ReduxStore } from 'redux';

// import all other reducers

const rootReducer = combineReducers({
  accounts: accountsReducer,
  routing: routerReducer,
  form: formReducer,
  apollo: apolloClient.reducer(),
  schedule: scheduleReducer,
  practical: practicalReducer,
  exercise: exerciseReducer,
  solution: solutionReducer,
  compiler: compilerReducer
});

export default rootReducer;

// typescript types holding all action creators

declare global {
  export interface IState {
    accounts: IAccountsState<SystemUser>;
    schedule: IScheduleState;
    practical: IPracticalState;
    exercise: IExerciseState;
    solution: ISolutionState;
    compiler: ICompilerState;
    // marks: IResult[];
    // mark: IResult;
  }

  export interface IStore extends ReduxStore<IState> {
  }

  export interface IActions {
    core: {
      check: Function;
    };
  }
}
