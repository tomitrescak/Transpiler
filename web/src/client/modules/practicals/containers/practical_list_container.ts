import { useDeps, composeWithTracker, composeAll } from "mantra-core";
import Component, { IComponentProps, IComponentActions, IComponent } from "../components/practical_list_view";

import Loading from "../../core/components/loading_view";

interface IProps {
  context?: () => IContext;
}

export const composer: IKomposer = ({context, clearSearch}: IComponent, onData: IKomposerData<IComponentProps>) => {
  const { Sub, Collections, LocalState }: IContext = context();

  let handleP = Sub.subscribe("practicals");
  let handleS = Sub.subscribe("schedules");

  if (handleP.ready() && handleS.ready()) {
    const options = {
      reactive: false,
      sort: {name: 1}
    };

    const searchText = LocalState.get(LocalState.keys.Search);
    let reg = searchText ? new RegExp(".*" + searchText + ".*", "i") : /.*/;
    let practicals = Collections.Practicals.find({ name: { $regex: reg } }, options).fetch();
    let schedule: IScheduleDAO = null;
    // build all schedules

    const componentData = {
      practicals,
      schedule,
      header: mf("practicals")
    };
    onData(null, componentData);
  } else {
    onData();
  }
  return clearSearch;
};

export const depsMapper = (context: IContext, actions: { practicals: IComponentActions }): IComponentActions => ({
  createPractical: actions.practicals.createPractical,
  clearSearch: actions.practicals.clearSearch,
  handleSearch: actions.practicals.handleSearch,
  context: () => context
});

export default composeAll<IProps>(
  composeWithTracker(composer, Loading),
  useDeps(depsMapper)
)(Component);
