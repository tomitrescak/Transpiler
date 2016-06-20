import { SEARCH, CLEAR_SEARCH } from './schedule_actions';

export interface IScheduleState {
  filter: string;
}

export function reducer (state = {}, action: any) {
  switch (action.type) {
    case SEARCH:
      return Object.assign({}, state, { filter: action.text });
    case CLEAR_SEARCH:
      return Object.assign({}, state, { filter: '' });
  }
  return state;
};
