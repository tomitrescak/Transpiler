import { useDeps, composeWithTracker, composeAll } from "mantra-core";
import Component, { IComponentProps } from "../components/console_view";
import Loading from "../../core/components/loading_view";
import { BoardConsole } from "../../../models/board_message_model";

interface IProps {
  context?: () => IContext;
}

export const composer: IKomposer = ({context}: IProps, onData: IKomposerData<IComponentProps>) => {
  onData(null, { messages: BoardConsole.find().fetch() });

  return null;
};

export default composeAll<IProps>(
  composeWithTracker(composer, Loading),
  useDeps()
)(Component);
