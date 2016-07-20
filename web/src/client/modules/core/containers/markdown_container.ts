import { connect } from 'meteor/tomi:apollo-mantra';
import Component, { IComponentProps } from '../components/markdown_view';

interface IProps {
  context?: () => IContext;
  text: string;
}

const mapStateToProps = (context: IContext, state: IState, ownProps: IProps): IComponentProps => ({
  html: context.Utils.Ui.parseMarkdown(ownProps.text)
});

export default connect<IProps>({ mapStateToProps })(Component);
