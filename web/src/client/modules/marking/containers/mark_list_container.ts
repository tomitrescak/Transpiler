import { useDeps, composeWithTracker, composeAll, IKomposer, IKomposerData } from 'mantra-core';
import Component, { IComponentProps } from '../components/mark_list_view';
import { connect } from 'react-redux';

interface IProps {
  id: string;
  context?: () => IContext;
}

export const composer: IKomposer = ({ context, id }: IProps, onData: IKomposerData<{}>) => {
  const { Meteor, Collections, Store }: IContext = context();
  if (Meteor.subscribe('results').ready()) {
    const options = {
      sort: { student: 1 }
    };
    const marks = Collections.Results.find({}, options).fetch();

    // store data in the store
    Store.dispatch({ type: 'RESULTS', marks });

    if (id) {
      Store.dispatch({ type: 'RESULT', mark: Collections.Results.findOne(id) });
    } else {
      Store.dispatch({ type: 'CREATE_RESULT'});
    }

    onData(null, {});
  } else {
    onData();
  }

  return null;
};

const mapStateToProps = (state: IState) => ({
  marks: state.marks
});

export default composeAll<IProps>(
  connect(mapStateToProps),
  composeWithTracker(composer),
  useDeps()
)(Component);
