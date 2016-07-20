import { connect } from 'meteor/tomi:apollo-mantra';
import Component, { IComponentProps } from './history_view';

interface IProps {
  context?: IContext;
  solutionId: string;
}

const mapStateToProps = (context: IContext, state: IState, ownProps: IProps): IComponentProps => ({
});

export default connect<IProps>({ mapStateToProps })(Component);
