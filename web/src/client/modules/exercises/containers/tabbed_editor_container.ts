import { connect } from 'meteor/tomi:apollo-mantra';
import Component, { IComponentActions } from '../components/tabbed_editor';

import * as actions from '../actions/compiler_actions';

interface IProps {
  libraries: ITextFileDAO[];
  files: ITextFileDAO[];
  id: string;
}

const mapDispatchToProps = ({ Store }: IContext, dispatch: Function, ownProps: IProps): IComponentActions  => ({
  initCompiler: () => {
    dispatch(actions.initCompiler(ownProps.id, ownProps.libraries));
  },
  compile: () => {
    dispatch(actions.compile(Store, ownProps.id, ownProps.files));
  }
});

export default connect<IProps>({ mapDispatchToProps })(Component);
