import { Mongo } from 'meteor/mongo';

declare global {
  export interface IScheduleItemDAO {
    from: Date;
    due: Date;
    practicalId: string;
    name: string;
  }

  export interface IScheduleTutorDAO {
    id: string;
    name: string;
    email: string;
  }

  export interface IScheduleDAO extends IAccessSchema {
    _id?: string;
    name: string;
    description: string;
    startDate: Date;
    items: IScheduleItemDAO[];
    tutors: IScheduleTutorDAO[];
    permissions: IPermissionsDAO;
    files: ITextFileDAO[];
    totalExercises?: number;
    achievements: IAchievementsDAO[];
    practicals: IPracticalDAO[];
  }
}

// import { Roles } from 'meteor/alanning:roles';
//
// import { PermissionSchema } from './schemas/permission_schema';
// import { SchemaHelpers } from './schemas/schema_helpers';
// import { TextFileSchema } from './schemas/text_file';
// import { Security } from '../models/security_model';
//
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
//
// // module Hugo.Collections {
// let ItemSchema = new SimpleSchema({
//   practicalId: {
//     type: String
//   },
//   name: {
//     type: String
//   },
//   from: {
//     type: Date,
//     optional: true
//   },
//   due: {
//     type: Date,
//     optional: true
//   }
// });
//
// let TutorSchema = new SimpleSchema({
//   name: {
//     type: String
//   },
//   id: {
//     type: String
//   },
//   email: {
//     type: String
//   }
// });
//
// let schema = SchemaHelpers.addAccessSchema({
//   name: {
//     type: String
//   },
//   description: {
//     type: String,
//     optional: true
//   },
//   startDate: {
//     type: Date,
//     optional: true
//   },
//   totalExercises: {
//     type: Number,
//     optional: true
//   },
//   items: {
//     type: [ItemSchema]
//   },
//   files: {
//     type: [TextFileSchema]
//   },
//   tutors: {
//     type: [TutorSchema]
//   },
//   permissions: {
//     type: PermissionSchema
//   }
// });

export let Schedules: Mongo.Collection<IScheduleDAO> = new Mongo.Collection<IScheduleDAO>('schedules');
//Schedules.attachSchema(schema);

// Collection2 already does schema checking
// Add custom permission rules if needed
// if (Meteor.isServer) {
//   Schedules.allow({
//     insert: (userId: string) => Roles.userIsInRole(userId, ['admin']),
//     update: (userId: string) => Roles.userIsInRole(userId, ['admin']),
//     remove: (userId: string) => Roles.userIsInRole(userId, ['admin'])
//   });
// }

export default Schedules;
