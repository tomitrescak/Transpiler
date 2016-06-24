import { useDeps, composeWithTracker, composeAll } from "mantra-core";
import Component, { IComponentProps, IComponentActions } from "../../schedules/components/schedule_list_view";
import Loading from "../../core/components/loading_view";

interface IProps {
  context?: () => IContext;
}

export const composer: IKomposer = ({context}: IProps, onData: IKomposerData<IComponentProps>) => {
  let { Sub, Collections, Models, LocalState } = context();

  let shandle = Sub.subscribe("schedules");
  if (shandle.ready()) {
    const options = {
      reactive: false,
      sort: {startDate: -1}
    };

    const searchText = LocalState.get(LocalState.keys.Search);
    const reg = searchText ? new RegExp(".*" + searchText + ".*", "i") : /.*/;

    onData(null, {
      schedules: Collections.Schedules.find({ name: { $regex: reg } }, options).fetch(),
      header: "leaderboards.label",
      icon: "trophy",
      route: "scheduleLeaderboards",
      showBadges: false,
      isAdmin: Models.Security.isAdmin()
    });
  } else {
    onData();
  }

  return null;
};

export const depsMapper = (context: IContext, actions: { schedule: IComponentActions} ): IComponentActions => ({
  create: actions.schedule.create,
  clearSearch: actions.schedule.clearSearch,
  handleSearch: actions.schedule.handleSearch,
  context: () => context
});

export default composeAll<IProps>(
  composeWithTracker(composer, Loading),
  useDeps(depsMapper)
)(Component);
