export class Actions {
  create = ({ Utils, Models, LocalState }: IContext) => {
    let name = LocalState.get(LocalState.keys.Search);
    let schedule = new Models.Schedule();
    schedule.name = name;

    let id = schedule.save(Utils.Ui.announceSaved((err: Meteor.Error) => {
      if (!err) {
        Utils.Router.go("adminSchedule", {
          _id: id,
          name: Utils.Router.encodeUrlName(schedule.name)
        });
      }
    }));
  };

  handleSearch = ({ LocalState }: IContext, text: string) => {
    LocalState.set(LocalState.keys.Search, text);
  };

  clearSearch = ({ LocalState }) => {
    return LocalState.set(LocalState.keys.Search, null);
  };
}

let actions = new Actions();
export default actions;
