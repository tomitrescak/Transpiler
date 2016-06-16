import { connect } from 'react-redux';
import { useDeps } from 'mantra-core';
import Layout, { IComponentActions } from '../components/header_view';

const mapStateToProps = (state: IState) => ({
  user: state.accounts.user
});

const mapDispatchToProps = (dispatch: any): IComponentActions => ({
  save: () =>
    dispatch({ type: 'SAVE' }),
  create: () =>
    dispatch({ type: 'CREATE_RESULT' }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
