import { Results } from '../../../../lib/collections';
import { Meteor } from 'meteor/meteor';
import { totalMark } from '../../../helpers/number_helpers';

export const marksReducer = (state: IResult[] = [], action: any): any => {
  switch (action.type) {
    case 'RESULTS':
      return action.marks;
  }
  return state;
};

export const markReducer = (state: IResult = null, action: any): any => {
  switch (action.type) {
    case 'CREATE_RESULT':
      return { result: [] };
    case 'RESULT':
      return action.mark;
    case 'CHANGE_MARK':
      const res = [
        ... state.result.splice(0, action.index),
        action.mark,
        ... state.result.splice(action.index + 1)
      ];
      return Object.assign({}, state, { result: res });
    case 'STUDENT':
        return Object.assign({}, state, { student: action.student });
    case 'SAVE':
      if (!state.student) {
        alert('Please specify student!');
        return state;
      };
      if (state._id) {
        Results.update(
          { _id: state._id },
          { $set: { result: state.result, student: state.student, total: totalMark(state.result)  }
        });
      } else {
        Results.insert({
          tutorId: Meteor.userId(),
          student: state.student,
          result: state.result,
          total: totalMark(state.result)
        });
      }
      return state;
  }
  return state;
};
