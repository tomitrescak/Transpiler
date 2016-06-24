import React from "react";

import PracticalsView from "./containers/practical_list_container";
import PracticalView from "./containers/practical_container";
import PracticalAdminView from "./containers/practical_admin_container";

export interface PracticalAdminRouteParams {
  name: string;
  _id: string;
}

export interface PracticalsRouteParams {
  name: string;
  _id: string;
}

export default function (injectDeps: IInjectDeps, { RouterConfig }: IContext) {
  const MainLayoutCtx = injectDeps(RouterConfig.layouts.mainLayout);
  const UserLayoutCtx = injectDeps(RouterConfig.layouts.userLayout);

  // mf("route.schedules", "") // this is to register a translation
  RouterConfig.anonymousRoutes.route("/practicals", {
    name: "practicals",
    action () {
      RouterConfig.mount(MainLayoutCtx, {
        content: () => (<PracticalsView />)
      });
    }
  });

  // mf("route.schedule", "")  // this is to register a translation
  RouterConfig.anonymousRoutes.route("/practical/:practicalName/:scheduleName/:practicalId/:scheduleId", {
    name: "practical",
    action ({practicalId, scheduleId}) {
      RouterConfig.mount(MainLayoutCtx, {
        content: () => (<PracticalView practicalId={practicalId} scheduleId={scheduleId} />)
      });
    }
  });

  // mf("route.adminSchedule", "")  // this is to register a translation
  RouterConfig.adminRoutes.route("/practical/:name/:_id", {
    name: "adminPractical",
    action ({name, _id}) {
      RouterConfig.mount(UserLayoutCtx, {
        content: () => (<PracticalAdminView practicalId={_id} />)
      });
    }
  });
}
