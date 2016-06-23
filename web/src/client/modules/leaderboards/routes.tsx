import React from "react";
import LeaderboardsView from "./containers/leaderboards_container";
import ScheduleLeaderboardsView from "./containers/leaderboards_schedule_container";
import PracticalLeaderboardsView from "./containers/leaderboards_practical_container";
import ExerciseLeaderboardsView from "./containers/leaderboards_exercise_container";

export interface ILeaderBoardRouteParams {
  name: string;
  _id: string;
}

export interface IPracticalLeaderBoardRouteParams {
  scheduleName: string;
  practicalName: string;
  scheduleId: string;
  practicalId: string;
}

// mf("route.exerciseLeaderboards", "");
export interface IExerciseLeaderBoardRouteParams {
  scheduleName: string;
  practicalName: string;
  exerciseName: string;
  scheduleId: string;
  practicalId: string;
  exerciseId: string;
}

export default function(injectDeps: IInjectDeps, { RouterConfig }: IContext) {
  const MainLayoutCtx = injectDeps(RouterConfig.layouts.mainLayout);

  // mf("route.leaderboards", "");
  RouterConfig.anonymousRoutes.route("/leaderboards", {
    name: "leaderboards",
    action() {
      RouterConfig.mount(MainLayoutCtx, {
        content: () => (<LeaderboardsView />)
      });
    }
  });

  // mf("route.scheduleLeaderboards", "");
  RouterConfig.anonymousRoutes.route("/leaderboards/:name/:_id", {
    name: "scheduleLeaderboards",
    action({_id}) {
      RouterConfig.mount(MainLayoutCtx, {
        content: () => (<ScheduleLeaderboardsView scheduleId={_id} />)
      });
    }
  });

  // mf("route.practicalLeaderboards", "");

  RouterConfig.anonymousRoutes.route("/leaderboards/:scheduleName/:practicalName/:scheduleId/:practicalId", {
    name: "practicalLeaderboards",
    action({scheduleId, practicalId}) {
      RouterConfig.mount(MainLayoutCtx, {
        content: () => (<PracticalLeaderboardsView scheduleId={scheduleId} practicalId={practicalId} />)
      });
    }
  });


  RouterConfig.anonymousRoutes.route("/leaderboards/:scheduleName/:practicalName/:exerciseName/:scheduleId/:practicalId/:exerciseId", {
    name: "exerciseLeaderboards",
    action({scheduleId, practicalId, exerciseId}) {
      RouterConfig.mount(MainLayoutCtx, {
        content: () => (<ExerciseLeaderboardsView scheduleId={scheduleId} practicalId={practicalId} exerciseId={exerciseId} />)
      });
    }
  });
}
