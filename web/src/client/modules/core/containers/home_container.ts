import Home from '../components/home_view';
import { connect } from 'react-redux';

interface IProps {
  id: string;
}

const mapStateToProps = (state: IState, ownProps: IProps) => ({
  user: state.accounts.user,
  id: ownProps.id
});

export default connect(mapStateToProps)(Home);
