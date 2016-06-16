import { useDeps, compose, composeAll, IKomposer, IKomposerData } from 'mantra-core';
import Component, { IComponentProps, IComponentActions } from '../components/marking_form_view';
import { connect } from 'react-redux';

interface IProps {
  context?: () => IContext;
}

const composer: IKomposer = ({ mark }: IComponentProps, onData: IKomposerData<IComponentProps>) => {
  if (mark) {
    onData(null, { mark });
  } else {
    onData();
  }
  return null;
};

const mapDispatchToProps = (dispatch: any, ownProps: any): IComponentActions => ({
  assignResult: (index: number, mark: any) =>
    dispatch({ type: 'CHANGE_MARK', index, mark }),
  changeStudent: (student: string) =>
    dispatch({ type: 'STUDENT', student }),
  save: () => {
    dispatch({ type: 'SAVE' });
  }
});

const mapStateToProps = (state: IState) => ({
  mark: state.mark
});

export default composeAll<IProps>(
  compose(composer),
  connect(mapStateToProps, mapDispatchToProps)
)(Component);
