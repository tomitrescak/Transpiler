import * as Collections from '../../../lib/collections/collections';

const schema = `
    type NotificationParameter {
      scheduleName: String,
      practicalName: String,
      exerciseName: String,
      rank: Int,
      count: Int,
      mark: Float
    }

    type Notification {
      _id: String,
      userId: String,
      code: String,
      date: Date,
      parameters: NotificationParameter
    }
  `;

const queryText = `
  notifications: [Notification]
`;

const queries = {
  notifications(root: any, params: any, context: any) {
    return Collections.Notifications.find({ userId: context.userId }, { sort: { date: -1 }, limit: 20 }).fetch();
  }
};

const resolvers = {
  Notification: {
    // date(notification: any) {
    //   return notification.date.getTime();
    // },
    parameters(notification: any) {
      return notification.parameters;
    }
  }
}

const mutations: any = null;

export default {
  schema,
  queryText,
  queries,
  resolvers,
  mutations,
};
