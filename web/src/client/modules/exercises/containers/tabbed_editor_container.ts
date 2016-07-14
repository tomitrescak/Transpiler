import { connect } from 'meteor/tomi:apollo-mantra';
import Component, { IComponentActions, IProps } from '../components/tabbed_editor';

import * as actions from '../actions/compiler_actions';

// interface IProps {
//   files: ITextFileDAO[];
//   id: string;
//   updateFile: (file: string, source: string) => void;
//   classes: string;
// }

const mapDispatchToProps = ({ Store }: IContext, dispatch: Function, ownProps: IProps): IComponentActions  => ({
  initCompiler: () => {
    dispatch(actions.initCompiler(ownProps.id, ownProps.fileActions.getLibraries(Store.getState())));
  },
  compile: () => {
    dispatch(actions.compile(Store, ownProps.id, ownProps.fileActions.getFiles(Store.getState())));
  },
  toggleShowAllFiles: (show: boolean) => {
    dispatch(actions.toggleShowAllFiles(ownProps.id, show));
  }
});

const mapStateToProps = (context: IContext, state: IState, ownProps: IProps) => ({
  context,
  showAllFiles: state.compiler.sessions[ownProps.id] ? state.compiler.sessions[ownProps.id].showAllFiles : false
});

export default connect<IProps>({ mapDispatchToProps, mapStateToProps })(Component);
