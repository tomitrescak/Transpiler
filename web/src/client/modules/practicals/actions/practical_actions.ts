import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";

class Actions {
  createPractical = (context: IContext, name: string) => {
    const { Utils, Models } = context;
    let practical = new Models.Practical(context.Collections);
    practical.name = name;

    let id = practical.save(Utils.Ui.announceSaved((err: Meteor.Error) => {
      if (!err) {
        Utils.Router.go("adminPractical", { _id: id, name: Utils.String.encodeUrlName(practical.name) });
      }
    }));
  };

  createExercise = (context: IContext, practical: IPractical) => {
    const { Models, Utils, FlowRouter, LocalState } = context;
    let name = LocalState.get(LocalState.keys.Search);
    let exercise = new Models.Exercise();
    exercise.name = name;
    exercise.save(Utils.Ui.announceSaved((err: Meteor.Error, id: string) => {
      if (!err) {
        let prac = new Models.Practical(context.Collections, practical);
        prac.exercises.push(id);
        prac.save(Utils.Ui.announceSaved());

        FlowRouter.go("adminExercise", { _id: id, name: Utils.String.encodeUrlName(exercise.name)});
      }
    }));
  };

  handleSearch = ({ LocalState }: IContext, text: string) => {
    LocalState.set(LocalState.keys.Search, text);
  };

  clearSearch = ({ LocalState }) => {
    return LocalState.set(LocalState.keys.Search, null);
  };

  zipPath = (context: IContext, scheduleId: string, practicalId: string) => {
    if (Session.get("userSecret") == null) {
        Meteor.call("getSecretKey", function(error: Meteor.Event, secret: string) {
          Session.set("userSecret", secret);
        });
      }
      return `/zip?scheduleId=${scheduleId}&practicalId=${practicalId}&token=${Session.get("userSecret")}`;
  };

  resultsPath = (context: IContext, scheduleId: string, practicalId: string) => {
    if (Session.get("userSecret") == null) {
        Meteor.call("getSecretKey", function(error: Meteor.Event, secret: string) {
          Session.set("userSecret", secret);
        });
      }
      return `/resultscsv?scheduleId=${scheduleId}&practicalId=${practicalId}&token=${Session.get("userSecret")}`;
  };
};
let actions = new Actions();
export default actions;
