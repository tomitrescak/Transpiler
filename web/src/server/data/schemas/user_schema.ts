import { Solutions } from '../../../lib/collections/collections';
import { IActionSubscribe, IActionUnSubscribe } from '../../../client/modules/schedules/actions/schedule_subscription_actions';
import { Meteor } from 'meteor/meteor';

const mutationText = `
  subscribe(scheduleId: String, tutorId: String, tutorName: String): [Subscription]
  unsubscribe(scheduleId: String): [Subscription]
`

const schema = `
  type Subscription {
    scheduleId: String
    tutorId: String
    tutorName: String
  }
`

const mutations = {
  subscribe(root: any, params: IActionSubscribe, { user, userId }: IApolloContext) {
    const { scheduleId, tutorId, tutorName } = params;

    // update all solutions
    Solutions.update(
      { createdById: userId, scheduleId: scheduleId },
      { $set: { tutorId: tutorId, tutorName: tutorName }},
      { multi: true }
    );

    // get subscriptions
    let subscriptions = user.profile.schedules;
    if (!subscriptions) {
      subscriptions = [];
    }
    subscriptions.push(params);

    // update user record
    Meteor.users.update(
      { _id: userId },
      { $set: { 'profile.schedules': subscriptions } }
    );

    return subscriptions;
  },
  unsubscribe(root: any, params: IActionUnSubscribe, { user, userId }: IApolloContext) {
    // get subscriptions
    let subscriptions = user.profile.schedules.filter((s: any) => s.scheduleId !== params.scheduleId);
    Meteor.users.update(
      { _id: userId },
      { $set: { 'profile.schedules': subscriptions } }
    );
    return subscriptions;
  }
};


const defintion: IApolloDefinition = {
  schema,
  mutations,
  mutationText
};

console.log('Adding user ...')

export default defintion;
