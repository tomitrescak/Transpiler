import { composeAll, compose } from 'mantra-core';

import Component from '../components/notification_view';
import { connect } from 'react-apollo';
import apolloContainer from '../../core/containers/apollo_container';

interface IProps {
  context: () => IContext;
  clearErrors: Function;
}

interface IData {
  notifications: any;
}

const mapQueriesToProps = ({ state }: any): IGraphqlQuery => {
  return {
    data: {
      query: gql`
         {
            notifications {
              _id
              userId
              code
              date
              parameters {
                scheduleName
                practicalName
                exerciseName
                rank
                count
                mark
              }
            }
          }
        `
    }
  };
};

export default composeAll(
  compose(apolloContainer()),
  connect({ mapQueriesToProps })
)(Component);
