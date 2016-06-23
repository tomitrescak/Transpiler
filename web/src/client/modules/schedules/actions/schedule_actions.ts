export const SEARCH = 'SCHEDULE: Search';
export const CLEAR_SEARCH = 'SCHEDULE: Clear Search';
export const CREATE = 'SCHEDULE: Create';

// export function create({ Utils, Models, LocalState }: IContext) {
//   let name = LocalState.get(LocalState.keys.Search);
//   let schedule = new Models.Schedule();
//   schedule.name = name;
//
//   let id = schedule.save(Utils.Ui.announceSaved((err: Meteor.Error) => {
//     if (!err) {
//       Utils.Router.go("adminSchedule", {
//         _id: id,
//         name: Utils.Router.encodeUrlName(schedule.name)
//       });
//     }
//   }));
// };

export function handleSearch (text: string) {
  return {
    type: SEARCH,
    text
  }
}

// automatically diapatched actions

import store from '../../../configs/store';

export function clearSearch () {
  store.dispatch({
    type: CLEAR_SEARCH
  });
}
