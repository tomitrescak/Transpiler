import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import { getRootNode } from '../../helpers/routing_helpers';

// apollo

import { ApolloProvider } from 'react-apollo';
import apolloClient from '../../configs/apollo';

// init redbox

import Redbox from 'redbox-react';

const consoleErrorReporter = ({ error }: any) => {
  console.error(error);
  return <Redbox error={error} />;
};

// Hot reload

import { AppContainer as HotLoaderAppContainer } from 'react-hot-loader';
import AppRoutes from './routes';

export default function (inject: Function, {Store}: IContext) {
  const history = syncHistoryWithStore(browserHistory, Store);

  const renderApp = (CurrentAppRoutes: any) => {
    ReactDOM.render(
      <HotLoaderAppContainer errorReporter={consoleErrorReporter}>
        <ApolloProvider store={Store} client={apolloClient}>
          <CurrentAppRoutes history={ history } injectDeps={inject} />
        </ApolloProvider>
      </HotLoaderAppContainer>,
      getRootNode('react-root')
    );
  };

  renderApp(AppRoutes);

  if (module.hot) {
    module.hot.accept('./routes.jsx', () => {
      const NextAppRoutes = require('./routes').default;
      renderApp(NextAppRoutes);
    });
  }
};
