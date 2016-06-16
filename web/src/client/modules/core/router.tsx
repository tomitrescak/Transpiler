import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import { getRootNode } from '../../helpers/routing_helpers';

// apollo

import { ApolloProvider } from 'react-apollo';
import { client } from '../../configs/apollo';

// Hot reload
import { AppContainer as HotLoaderAppContainer } from 'react-hot-loader';
import AppRoutes from './routes';

export default function (inject: Function, {Store}: IContext) {
  const history = syncHistoryWithStore(browserHistory, Store);

  const renderApp = (CurrentAppRoutes: any) => {
    ReactDOM.render(
      <HotLoaderAppContainer>
        <ApolloProvider store={Store} client={client}>
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
