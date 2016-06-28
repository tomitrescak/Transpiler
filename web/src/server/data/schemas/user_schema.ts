import { Solutions } from '../../../lib/collections/collections';
import { IActionSubscribe, IActionUnSubscribe } from '../../../client/modules/schedules/actions/schedule_subscription_actions';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

interface ISecretsDAO {
  _id?: string;
  user: string;
  date: Date;
}

// only on server!!!
export let Secrets: Mongo.Collection<ISecretsDAO> = new Mongo.Collection<ISecretsDAO>('secrets');

const queryText = `
  userSecret: String
`

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

const queries = {
  userSecret(root: any, params: any, { userId }: IApolloContext) {
    if (!userId) {
      // check if the user has privileges
      throw new Meteor.Error('403', 'Not authorised! You need to be logged in!');
    }
    Secrets.remove({ user: userId });
    return Secrets.insert({ user: userId, date: new Date() });
  }
};

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
  mutationText,
  queryText,
  queries
};

console.log('Adding user ...')

export default defintion;
