import { connect } from 'meteor/tomi:apollo-mantra';
import Component, { IComponentActions } from '../components/tabbed_editor';

import * as compilerActions from '../../exercises/actions/compiler_actions';
import * as editorActions from '../actions/text_editor_actions';

// interface IProps {
//   files: ITextFileDAO[];
//   id: string;
//   updateFile: (file: string, source: string) => void;
//   classes: string;
// }

export interface IProps {
  id: string;
  fileActions: IFileEditorActions;
  classes?: string;
  showAdminControls?: boolean;
}

const mapDispatchToProps = ({ Store }: IContext, dispatch: Function, ownProps: IProps): IComponentActions  => ({
  initCompiler: () => {
    dispatch(compilerActions.initCompiler(ownProps.id, ownProps.fileActions.getLibraries()));
  },
  compile: () => {
    dispatch(compilerActions.compile(Store, ownProps.id, ownProps.fileActions.getFiles()));
  },
  toggleShowAllFiles: (show: boolean) => {
    ownProps.fileActions.toggleShowAllFiles();
  }
});

const mapStateToProps = (context: IContext, state: IState, ownProps: IProps) => ({
  context,
  files: state.editor.editors[ownProps.id].files,
  showAllFiles: state.editor.editors[ownProps.id].showAllFiles
});

export default connect<IProps>({ mapDispatchToProps, mapStateToProps })(Component);
