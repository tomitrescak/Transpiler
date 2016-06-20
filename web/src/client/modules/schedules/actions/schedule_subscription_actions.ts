export default {
  subscribe({ User, Utils, ServerMethods }: IContext, scheduleId: string, tutorId: string, tutorName: string) {
    User.subscribe(scheduleId, tutorId, tutorName);

    ServerMethods.updateTutorSubscription.call(
      { schedules: User.profile.schedules, scheduleId: scheduleId, tutorId: tutorId, tutorName: tutorName },
      Utils.Ui.announceSaved((error) => {
        // reset ui in case of error
        if (error) {
          User.unsubscribe(scheduleId);
        }
      }));
  },
  unsubscribe({ User, Utils, ServerMethods }: IContext, scheduleId: string) {
    const subscription = User.getScheduleSubscription(scheduleId);

    User.unsubscribe(scheduleId);

    ServerMethods.updateTutorSubscription.call(
      { schedules: User.profile.schedules, scheduleId: scheduleId, tutorId: null, tutorName: null },
      Utils.Ui.announceSaved((error) => {
        // reset ui in case of error
        if (error) {
          User.subscribe(subscription.scheduleId, subscription.tutorId, subscription.tutorName);
        }
      }));
  }
}
