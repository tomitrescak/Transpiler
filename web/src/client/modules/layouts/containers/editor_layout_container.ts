import { useDeps, composeAll } from 'mantra-core';
import Layout from '../components/editor_layout';
import { connect } from 'react-redux';

const mapStateToProps = (state: IState) => ({
  user: state.accounts.user,
  loggingIn: state.accounts.loggingIn
});

const depsToPropsMapper = (context: IContext) => ({
  context: context
});

export const LayoutView = composeAll(
  connect(mapStateToProps),
  useDeps(depsToPropsMapper)
)(Layout);

export default LayoutView;
