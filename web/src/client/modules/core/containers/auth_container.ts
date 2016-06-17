import { connect } from 'react-redux';

function noRole() { return false; }

const mapStateToProps = (state: IState) => ({
  user: state.accounts.user,
  isAdmin: state.accounts.user ? state.accounts.user.isAdmin() : false,
  isRole: state.accounts.user ? state.accounts.user.isRole : noRole,
  loggingIn: state.accounts.loggingIn
});

export default (component: any) => connect(mapStateToProps)(component);
