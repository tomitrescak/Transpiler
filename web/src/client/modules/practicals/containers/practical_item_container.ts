// import { useDeps, composeWithTracker, composeAll } from "mantra-core";
// import Component, { IComponentProps } from "../components/practical_item_view";
// import Loading from "../../core/components/loading_view";
//
// interface IProps {
//   context?: () => IContext;
//   scheduleId?: string;
//   isVisible?: boolean;
//   practical: IPracticalDAO;
// }
//
// export const composer: IKomposer = ({context, scheduleId, practical, isVisible}: IProps, onData: IKomposerData<IComponentProps>) => {
//   const { Collections, User, Models: { Permission } }: IContext = context();
//
//   let schedules: IScheduleDAO[] = [];
//   if (!scheduleId) {
//      schedules = Collections.Schedules.find({ "items.practicalId": practical._id }, { reactive: false }).fetch();
//   } else {
//      schedules = Collections.Schedules.find(scheduleId).fetch();
//   }
//
//   let data = {
//     schedules,
//     canWrite: Permission.canWrite(practical.permissions, User.info()),
//     context,
//     practical,
//     isVisible
//   };
//
//   onData(null, data);
//
//   return null;
// };
//
// export default composeAll<IProps>(
//   composeWithTracker(composer, Loading),
//   useDeps()
// )(Component);
