import { Mongo } from 'meteor/mongo';

// var notificationsSchema = new SimpleSchema({
//   userId: {
//     type: String
//   },
//   code: {
//     type: String
//   },
//   parameters: {
//     type: Object,
//     optional: true
//   },
//   date: {
//     type: Date
//   }
// });

/**
 * @interface IExerciseDAO
 */

declare global {
  export interface INotificationDAO extends IEntityDAO {
    userId?: string;
    code: string;
    parameters: Object;
    date: Date;
    scheduleId: string;
  }
}

export let Notifications: Mongo.Collection<INotificationDAO> = new Mongo.Collection<INotificationDAO>('notifications');

export default Notifications;
// Notifications.attachSchema(notificationsSchema);
