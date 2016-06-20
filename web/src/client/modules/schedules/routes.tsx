// import React from "react";
// import SchedulesView from "./containers/schedule_list_container";
// import ScheduleView from "./containers/schedule_container";
// import ScheduleAdminView from "./containers/schedule_admin_container";
//
// export interface ScheduleRouteParams {
//   name: string;
//   _id: string;
// }
//
// export default function (injectDeps: IInjectDeps, { RouterConfig }: IContext) {
//   const MainLayoutCtx = injectDeps(RouterConfig.layouts.mainLayout);
//   const UserLayoutCtx = injectDeps(RouterConfig.layouts.userLayout);
//
//   // mf("route.schedules", "") // this is to register a translation
//   RouterConfig.anonymousRoutes.route("/schedules", {
//     name: "schedules",
//     action () {
//       RouterConfig.mount(MainLayoutCtx, {
//         content: () => (<SchedulesView header="schedules.label" icon="calendar" route="schedule" showBadges={true} />)
//       });
//     }
//   });
//
//   // mf("route.schedule", "")  // this is to register a translation
//   RouterConfig.anonymousRoutes.route("/schedule/:name/:_id", {
//     name: "schedule",
//     action ({_id }) {
//       RouterConfig.mount(MainLayoutCtx, {
//         content: () => (<ScheduleView scheduleId={_id} />)
//       });
//     }
//   });
//
//   // mf("route.adminSchedule", "")  // this is to register a translation
//   RouterConfig.adminRoutes.route("/schedule/:name/:_id", {
//     name: "adminSchedule",
//     action ({name, _id}) {
//       RouterConfig.mount(UserLayoutCtx, {
//         content: () => (<ScheduleAdminView scheduleId={_id} />)
//       });
//     }
//   });
// }
