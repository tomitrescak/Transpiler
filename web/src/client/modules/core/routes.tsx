import React from 'react';
import {Router, Route, IndexRoute } from 'react-router';

// Layouts
import MainLayout from '../layouts/containers/main_layout_container';
import EditorLayout from '../layouts/containers/editor_layout_container'

// Components
import HomePage from '../home/containers/home_container';
import ExtraFooterView from '../home/components/extra_footer_view';
import SchedulesList from '../schedules/containers/schedule_list_container';
import ScheduleView from '../schedules/containers/schedule_container';
import PracticalView from '../practicals/containers/practical_container';
import ExerciseView from '../exercises/containers/exercise_container';

import * as scheduleActions from '../schedules/actions/schedule_actions';
import * as practicalActions from '../practicals/actions/practical_actions';
// import * as exerciseActions from '../exercises/actions/exercise_actions';
// import * as solutionActions from '../exercises/actions/solution_actions';

const AppRoutes = ({ history, injectDeps }: any) => {
  const MainLayoutCtx = injectDeps(MainLayout);
  const EditorLayoutCtx = injectDeps(EditorLayout);

  return (
    <Router history={history}>
      <Route path="/" component={MainLayoutCtx}>
        <IndexRoute components={{ main: HomePage, extraFooter: ExtraFooterView }} />
        <Route path="schedules"
          component={() => <SchedulesList route="schedule" icon="calendar" header="schedules" showBadges />}
          onEnter={scheduleActions.clearSearch} />
        <Route path="schedule/:name/:id"
          component={ScheduleView}
          onEnter={scheduleActions.clearSearch} />
        <Route path="practical/:practicalName/:scheduleName/:practicalId/:scheduleId"
          component={PracticalView}
          onEnter={practicalActions.clearSearch} />
      </Route>
      <Route path="/editor" component={EditorLayoutCtx}>
        <Route path="exercise/:exerciseName/:practicalName/:scheduleName/:exerciseId/:practicalId/:scheduleId"
          component={ExerciseView}
          // onLeave={exerciseActions.checkSavedData}
           />
      </Route>
    </Router>
  );
};



export default AppRoutes;
