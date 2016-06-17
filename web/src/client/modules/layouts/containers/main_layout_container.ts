import { useDeps, composeAll } from 'mantra-core';
import Layout from '../components/main_layout';
import { connect } from 'react-redux';

const mapStateToProps = (state: IState) => ({
  user: state.accounts.user,
  loggingIn: state.accounts.loggingIn
});

const depsToPropsMapper = (context: IContext) => ({
  context: context,
  store: context.Store,
});

export const MainLayout = composeAll(
  connect(mapStateToProps),
  useDeps(depsToPropsMapper)
)(Layout);

export default MainLayout;
