import React from 'react';
import {Router, Route, IndexRoute } from 'react-router';

// Components
import MainLayout from '../layouts/containers/main_layout_container';
import HomePage from '../home/containers/home_container';
import ExtraFooterView from '../home/components/extra_footer_view';
import SchedulesList from '../schedules/containers/schedule_list_container';
import ScheduleView from '../schedules/containers/schedule_container';
import PracticalView from '../practicals/containers/practical_container';

import * as scheduleActions from '../schedules/actions/schedule_actions';
import * as practicalActions from '../practicals/actions/practical_actions';

const AppRoutes = ({ history, injectDeps }: any) => {
  const MainLayoutCtx = injectDeps(MainLayout);

  return (
  <Router history={history}>
    <Route path="/" component={MainLayoutCtx}>
      <IndexRoute components={{ main: HomePage, extraFooter: ExtraFooterView }} />
      <Route path="schedules" onEnter={scheduleActions.clearSearch} component={() => <SchedulesList route="schedule" icon="calendar" header="schedules" showBadges />}  />
      <Route path="schedule/:name/:id" component={ScheduleView}  />
      <Route path="practical/:practicalName/:cheduleName/:practicalId/:scheduleId" onEnter={practicalActions.clearSearch} component={PracticalView}  />
    </Route>
  </Router>
)};

export default AppRoutes;
