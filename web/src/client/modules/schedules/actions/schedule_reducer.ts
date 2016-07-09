import { SEARCH, CLEAR_SEARCH } from './schedule_actions';
import { getQuery, copyQuery } from 'meteor/tomi:apollo-mantra';

export interface IScheduleState {
  filter: string;
  schedules: {
    [id: string]: IScheduleDAO
  };
}

export function reducer (state = {}, action: any) {
  switch (getQuery(action)) {
    case 'schedule':
      return copyQuery(state, 'schedules', action.result.data.schedule);
  }

  switch (action.type) {
    case SEARCH:
      return Object.assign({}, state, { filter: action.text });
    case CLEAR_SEARCH:
      return Object.assign({}, state, { filter: '' });
  }
  return state;
};
