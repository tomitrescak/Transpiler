import Exercise from "../../../models/exercise_model";

class Actions {
  handleSearch = ({ LocalState }: IContext, text: string) => {
    LocalState.set(LocalState.keys.Search, text);
  };

  clearSearch = ({ LocalState }) => {
    return LocalState.set(LocalState.keys.Search, null);
  };

  createExercise = ({ Utils, LocalState}: IContext) => {
    let name = LocalState.get(LocalState.keys.Search);
    let exercise = new Exercise();
    exercise.name = name;
    let id = exercise.save(Utils.Ui.announceSaved((err: Meteor.Error) => {
      if (!err) {
        Utils.Router.go("adminExercise", { _id: id, name: Utils.String.encodeUrlName(exercise.name) });
      }
    }));
  };
};
let actions = new Actions();
export default actions;
