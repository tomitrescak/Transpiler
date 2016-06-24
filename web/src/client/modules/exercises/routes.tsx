import React from "react";
import ExercisesView from "./containers/exercise_list_container";
import ExerciseView from "./containers/exercise_container";
import AdminExerciseView from "./containers/exercise_admin_container";

export interface ExerciseRouteParams {
  exerciseName: string;
  practicalName: string;
  scheduleName: string;
  exerciseId: string;
  practicalId: string;
  scheduleId: string;
}

export interface AdminExerciseRouteParams {
  name: string;
  _id: string;
}

export default function (injectDeps: IInjectDeps, { RouterConfig }: IContext) {
  const MainLayoutCtx = injectDeps(RouterConfig.layouts.mainLayout);
  const UserLayoutCtx = injectDeps(RouterConfig.layouts.userLayout);
  const ClearLayoutCtx = injectDeps(RouterConfig.layouts.clearLayout);
  const ClearUserLayoutCtx = injectDeps(RouterConfig.layouts.clearUserLayout);

  // mf("route.schedules", "") // this is to register a translation
  RouterConfig.anonymousRoutes.route("/exercises", {
    name: "exercises",
    action () {
      RouterConfig.mount(MainLayoutCtx, {
        content: () => (<ExercisesView />)
      });
    }
  });

  // mf("route.schedule", "")  // this is to register a translation
  RouterConfig.anonymousRoutes.route("/exercise/:exerciseName/:practicalName/:scheduleName/:exerciseId/:practicalId/:scheduleId", {
    name: "exercise",
    action ({exerciseId, practicalId, scheduleId, userId}) {
      RouterConfig.mount(ClearLayoutCtx, {
        content: () => (<ExerciseView practicalId={practicalId} scheduleId={scheduleId} exerciseId={exerciseId} userId={userId} background="blackBackground" />)
      });
    }
  });

  // mf("route.schedule", "")  // this is to register a translation
  RouterConfig.userRoutes.route("/exercise/:exerciseName/:practicalName/:scheduleName/:exerciseId/:practicalId/:scheduleId/:userId", {
    name: "tutorsExercise",
    action ({exerciseId, practicalId, scheduleId, userId}) {
      RouterConfig.mount(ClearUserLayoutCtx, {
        roles: ["tutor", "admin"],
        content: () => (<ExerciseView practicalId={practicalId} scheduleId={scheduleId} exerciseId={exerciseId} userId={userId} background="blackBackground" />)
      });
    }
  });

  // mf("route.adminSchedule", "")  // this is to register a translation
  RouterConfig.adminRoutes.route("/exercise/:name/:_id", {
    name: "adminExercise",
    action ({_id}) {
      RouterConfig.mount(UserLayoutCtx, {
        content: () => (<AdminExerciseView exerciseId={_id} />)
      });
    }
  });
}
