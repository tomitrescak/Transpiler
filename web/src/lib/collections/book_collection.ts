import { Mongo } from 'meteor/mongo';

declare global {
  export interface IBookChapterDAO {
    _id?: string;
    title: string;
    index: number;
    text: string;
    images: string[];
    introduction: string;
    permissions: IPermissionsDAO;
    key?: string; // REACT CRAP
  }
}

// import { Meteor } from 'meteor/meteor';
// import { Roles } from 'meteor/alanning:roles';
//
// import { PermissionSchema } from './schemas/permission_schema';
// import { SchemaHelpers } from './schemas/schema_helpers';
//
// let schema = SchemaHelpers.addAccessSchema({
//   title: {
//     type: String
//   },
//   index: {
//     type: Number
//   },
//   text: {
//     type: String,
//     optional: true
//   },
//   images: {
//     type: [String]
//   },
//   permissions: {
//     type: PermissionSchema
//   },
//   introduction: {
//     type: String
//   }
// });

export let Books: Mongo.Collection<IBookChapterDAO> = new Mongo.Collection<IBookChapterDAO>('book');
// Books.attachSchema(schema);

// if (Meteor.isServer) {
//   Books.allow({
//     insert: (userId: string, doc: any) => Roles.userIsInRole(userId, 'author'),
//     update: (userId: string, doc: any) => Roles.userIsInRole(userId, 'author'),
//     remove: (userId: string, doc: any) => Roles.userIsInRole(userId, 'author')
//   });
// }

export default Books;
