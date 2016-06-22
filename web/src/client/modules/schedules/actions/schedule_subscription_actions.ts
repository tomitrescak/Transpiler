import client from '../../../configs/apollo';

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
    // asynchronously
    return (dispatch: Function, state: () => IState) => {
      client.mutate({
        mutation: gql`
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
        }
      }).then((graphQLResult: any) => {
        const { errors, data } = graphQLResult;

        if (data) {
          console.log('got data', data);

          // change client
          dispatch({
            type: SUBSCRIBE,
            subscriptions: data.subscribe
          })
        }

        if (errors) {
          console.log('got some GraphQL execution errors', errors);
        }
      }).catch((error: any) => {
        console.log('there was an error sending the query', error);
      });

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
      return null;
    };
  },
  unsubscribe(scheduleId: string, state: () => IState) {
    // asynchronously
    return (dispatch: Function): any => {
      client.mutate({
        mutation: gql`
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
        }
      }).then((graphQLResult: any) => {
        const { errors, data } = graphQLResult;

        if (data) {
          console.log('got data', data);

          // change client
          dispatch({
            type: UNSUBSCRIBE,
            subscriptions: data.unsubscribe
          });
        } else {
          console.log('got data', data);
        }

        if (errors) {
          console.log('got some GraphQL execution errors', errors);
        }
      }).catch((error: any) => {
        console.log('there was an error sending the query', error);
      });
      return null;
    };
  }

};
