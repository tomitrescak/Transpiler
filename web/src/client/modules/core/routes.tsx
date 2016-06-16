import React from 'react';
import {Router, Route, IndexRoute} from 'react-router';

// Components
import MainLayout from './containers/layout_container';
import HomePage from './containers/home_container';

const AppRoutes = ({ history, injectDeps }: any) => {
  const MainLayoutCtx = injectDeps(MainLayout);

  return (
  <Router history={history}>
    <Route path="/" component={MainLayoutCtx}>
      <IndexRoute component={HomePage} />
      <Route path="/edit/:id" component={HomePage} />
    </Route>
  </Router>
)};

export default AppRoutes;
