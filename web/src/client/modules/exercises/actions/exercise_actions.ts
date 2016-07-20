// import Exercise from "../../../models/exercise_model";
//
// class Actions {
//   handleSearch = ({ LocalState }: IContext, text: string) => {
//     LocalState.set(LocalState.keys.Search, text);
//   };
//
//   clearSearch = ({ LocalState }) => {
//     return LocalState.set(LocalState.keys.Search, null);
//   };
//
//   createExercisze = ({ Utils, LocalState}: IContext) => {
//     let name = LocalState.get(LocalState.keys.Search);
//     let exercise = new Exercise();
//     exercise.name = name;
//     let id = exercise.save(Utils.Ui.announceSaved((err: Meteor.Error) => {
//       if (!err) {
//         Utils.Router.go("adminExercise", { _id: id, name: Utils.String.encodeUrlName(exercise.name) });
//       }
//     }));
//   };
// };
// let actions = new Actions();
// export default actions;

export const SEARCH = 'EXERCISE: Search';
export const CLEAR_SEARCH = 'EXERCISE: Clear Search';
export const CREATE = 'EXERCISE: Create';

export function handleSearch(text: string) {
  return {
    type: SEARCH,
    text
  }
}

// automatically diapatched actions

export function clearSearch(store: IStore) {
  store.dispatch({
    type: CLEAR_SEARCH
  });
}
