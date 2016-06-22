export const SUBSCRIBE = 'SCHEDULE: Subscribe';
export const UNSUBSCRIBE = 'SCHEDULE: Unsubscribe';

export interface IActionSubscribe extends IReduxAction {
  scheduleId: string;
  tutorId: string;
  tutorName: string;
}

export interface IActionUnSubscribe extends IReduxAction {
  scheduleId: string;
}

export default {
  subscribe(scheduleId: string, tutorId: string, tutorName: string) {
    return {
      type: SUBSCRIBE,
      scheduleId,
      tutorId,
      tutorName
    }
    // User.subscribe(scheduleId, tutorId, tutorName);
    //
    // ServerMethods.updateTutorSubscription.call(
    //   { schedules: User.profile.schedules, scheduleId: scheduleId, tutorId: tutorId, tutorName: tutorName },
    //   Utils.Ui.announceSaved((error) => {
    //     // reset ui in case of error
    //     if (error) {
    //       User.unsubscribe(scheduleId);
    //     }
    //   }));
  },
  unsubscribe(scheduleId: string) {
    return {
      type: UNSUBSCRIBE,
      scheduleId
    }
  }
}
