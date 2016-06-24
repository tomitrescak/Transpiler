import { useDeps, composeWithTracker, composeAll } from "mantra-core";
import Component, { IComponentProps, IComponentActions, IComponent } from "../components/exercise_list_view";
import Loading from "../../core/components/loading_view";

interface IProps {
  context?: () => IContext;
}

// export default class Container extends MantraContainer {
//   @composeWithTracker
//   composeModel({context}, onData) {
//     const {Meteor, Collections} = context();
//     if (Meteor.subscribe('sub').ready()) {
//       const comments = Collections.Comments.find().fetch();
//       onData(null, { comments });
//     } else {
//       onData();
//     }
//   }
//
//   @composeWithPromise(1)
//   composeOther({context}, onData) {
//     // ...
//   }
//
//   @compose(2)
//   composeYetAnother({context}, onData) {
//     // ...
//   }
//
//   registerActions() {
//     return {
//       create: actions.comments.create
//     }
//   }
// }

export const composer: IKomposer = ({context}: IProps, onData: IKomposerData<IComponentProps>) => {
  const { Sub, Collections, LocalState }: IContext = context();

  let handleS = Sub.subscribe("schedules");
  let handleP = Sub.subscribe("practicals");
  let handleE = Sub.subscribe("exercises");

  if (handleP.ready() && handleS.ready() && handleE.ready()) {
    const options = {
      reactive: false,
      sort: { name: 1 }
    };

    const searchText = LocalState.get(LocalState.keys.Search);
    let reg = searchText ? new RegExp(".*" + searchText + ".*", "i") : /.*/;
    let exercises = Collections.Exercises.find({ name: { $regex: reg } }, options).fetch();

    const componentData = {
      exercises,
      context
    };
    onData(null, componentData);
  } else {
    onData();
  }
  return null;
};

export const depsMapper = (context: IContext, actions: { exercises: IComponentActions }): IComponentActions => ({
  createExercise: actions.exercises.createExercise,
  clearSearch: actions.exercises.clearSearch,
  handleSearch: actions.exercises.handleSearch,
  context: () => context
});

export default composeAll<IProps>(
  composeWithTracker(composer, Loading),
  useDeps(depsMapper)
)(Component);
