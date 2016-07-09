import { Mongo } from 'meteor/mongo';

declare global {
  export interface IPracticalDAO extends IAccessSchema {
    _id?: string;
    name: string;
    image: string;
    description: string;
    lecture: string;
    files: ITextFileDAO[];
    exercises: IExerciseDAO[];
    ratedExercises: number;
    permissions: IPermissionsDAO;
  }
}

// import { Meteor } from 'meteor/meteor';
//
// import { PermissionSchema } from './schemas/permission_schema';
// import { SchemaHelpers } from './schemas/schema_helpers';
// import { TextFileSchema } from './schemas/text_file';
// import { Security } from '../models/security_model';
//
// // module Hugo.Collections {
//
// let schema = SchemaHelpers.addAccessSchema({
//   name: {
//     type: String
//   },
//   description: {
//     type: String,
//     optional: true
//   },
//   lecture: {
//     type: String,
//     optional: true
//   },
//   image: {
//     type: String,
//     optional: true
//   },
//   files: {
//     type: [TextFileSchema],
//     optional: true
//   },
//   exercises: {
//     type: [String]
//   },
//   ratedExercises: {
//     type: Number
//   },
//   permissions: {
//     type: PermissionSchema
//   }
// });


export let Practicals: Mongo.Collection<IPracticalDAO> = new Mongo.Collection<IPracticalDAO>('practicals');
//Practicals.attachSchema(schema);
//
// if (Meteor.isServer) {
//   Practicals.allow({
//     insert: (userId: string, doc: any) => Security.canWrite(userId, doc),
//     update: (userId: string, doc: any) => Security.canWrite(userId, doc),
//     remove: (userId: string, doc: any) => Security.canWrite(userId, doc)
//   });
// }

export default Practicals;
