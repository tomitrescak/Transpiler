import { mutation } from 'meteor/tomi:apollo-mantra';

export const SUBSCRIBE = 'SCHEDULE: Subscribe';
export const UNSUBSCRIBE = 'SCHEDULE: Unsubscribe';

export interface IActionSubscribe extends IReduxAction {
  scheduleId: string;
  tutorId: string;
  tutorName: string;
  //subscriptions: IScheduleSubscription[];
}

export interface IActionUnSubscribe extends IReduxAction {
  scheduleId: string;
}

export default {
  subscribe(scheduleId: string, tutorId: string, tutorName: string) {

    return mutation({
      query: `
        mutation subscribe(
          $scheduleId: String!
          $tutorId: String!
          $tutorName: String!
        ) {
          subscribe(scheduleId: $scheduleId, tutorId: $tutorId, tutorName: $tutorName) {
            tutorName,
            tutorId,
            scheduleId
          }
        }
      `,
      variables: {
        scheduleId,
        tutorId,
        tutorName
      },
      thenCallback(data: any, dispatch: any) {
        dispatch({
          type: SUBSCRIBE,
          subscriptions: data.subscribe
        });
      }
    });
  },
  unsubscribe(scheduleId: string) {
    // asynchronously
    return mutation({
      query: `
          mutation unsubscribe(
            $scheduleId: String!
          ) {
            unsubscribe(scheduleId: $scheduleId) {
              tutorName,
              tutorId,
              scheduleId
            }
          }
        `,
      variables: {
        scheduleId
      },
      thenCallback(data: any, dispatch: any) {
        dispatch({
          type: UNSUBSCRIBE,
          subscriptions: data.unsubscribe
        });
      }
    });
  }
};
