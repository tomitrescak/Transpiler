import { connect } from 'meteor/tomi:apollo-mantra';
import Component, { IComponentProps } from '../components/tabbed_editor_status_view';

interface IProps {
  sessionId: string;
  editors: any[];
}

const mapStateToProps = (context: IContext, state: IState, ownProps: IProps): IComponentProps  => ({
  session: state.compiler.sessions[ownProps.sessionId]
});

export default connect<IProps>({ mapStateToProps })(Component);
