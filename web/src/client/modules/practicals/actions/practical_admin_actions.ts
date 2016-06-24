
import Practical from "../../../models/practical_model";

class Actions {
  addExercise = ({ Utils, Collections, Models, Objects }: IContext, name: string) => {
    if (!name) {
      Utils.Ui.alertDialog("exercise.empty", "error"); // "Please specify the exercise name"
      return;
    }

    const exercise = Collections.Exercises.findOne({ name: name});
    const practical = Objects.Practical;

    if (exercise == null) {
      Utils.Ui.confirmDialog("confirm.createExercise", () => { // mf("confirm.createExercise", "")
        // "Exercise does not exist, do you want to create a new exercise?"
        let exerciseModel = new Models.Exercise();
        exerciseModel.name = name;
        exerciseModel.save(Utils.Ui.announceCreated((error: Meteor.Error, id: string) => {
          if (!error) {
            practical.exercises.push(id);
            practical.save(Utils.Ui.announceSaved());

            Utils.Router.go("adminExercise", { _id: id, name: Utils.String.encodeUrlName(name) });
          }
        }));
      }, "error.exerciseDoesNotExist", "create", "info");
      return;
    }
    practical.addExercise(exercise._id);
  };

  delete = ({ Utils, Objects }: IContext) => {
    Utils.Ui.confirmDialog("confirm.delete", () => {
      Objects.Practical.remove(Utils.Ui.announceDeleted(() => {
        Utils.Router.go("schedules");
      }));
    });
  };

  duplicate = (context: IContext) => {
    const { Utils, Objects } = context;
    Utils.Ui.confirmDialog("confirm.duplicate", () => {
      let practical = new Practical(context.Collections, Objects.Practical);
      practical._id = null;
      practical.name += "(Clone)";

      practical.save(Utils.Ui.announceDuplicated((error: Meteor.Error) => {
        if (!error) {
          Utils.Router.go("adminPractical", { _id: practical._id, name: Utils.Router.encodeUrlName(practical.name) });
        }
      }));
    }, "areYouSure", "duplicate", "info", true);
  };

  save = ({ Utils, ApplicationState, Objects }: IContext, practical: Practical) => {
    Objects.Practical.save(Utils.Ui.announceSaved(() => {
      ApplicationState.editorDirty = false;
    }));
  }

  removeExercise = ({ Utils }: IContext, practical: Practical, exerciseId: string) => {
    Utils.Ui.confirmDialog("confirm.areYouSure", () => {
      practical.removeExercise(exerciseId); // .exercises = Utils.Ui.removeFromArray(this.state.exercises, exerciseId);
    });
  };


};
let actions = new Actions();
export default actions;
