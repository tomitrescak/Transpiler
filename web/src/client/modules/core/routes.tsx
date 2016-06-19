import React from 'react';
import {Router, Route, IndexRoute } from 'react-router';

// Components
import MainLayout from '../layouts/containers/main_layout_container';
import HomePage from '../home/containers/home_container';
import ExtraFooterView from '../home/components/extra_footer_view';

const AppRoutes = ({ history, injectDeps }: any) => {
  const MainLayoutCtx = injectDeps(MainLayout);

  return (
  <Router history={history}>
    <Route path="/" component={MainLayoutCtx}>
      <IndexRoute components={{ main: HomePage, extraFooter: ExtraFooterView }} />
      <Route path="/edit/:id" component={HomePage} />
    </Route>
  </Router>
)};

export default AppRoutes;
