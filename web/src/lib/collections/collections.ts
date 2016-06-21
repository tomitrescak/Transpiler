import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

declare global {
  export interface IEditorPosition {
    row: number;
    column: number;
  }

  export interface IEntityDAO {
    _id?: string;
  }

  export interface IAccessSchema extends IEntityDAO {
    createdBy?: string;
    createdById?: string;
    createdAt?: Date;
    updatedBy?: string;
    updatedById?: string;
    updatedAt?: Date;
  }

  export interface ITextFileDAO {
    id?: string;
    type: string;
    name: string;
    source: string;
    position?: IEditorPosition;
    top?: number;
    index?: number;
  }

  export interface IPermissionGroupDAO {
    name: string;
    access: number;
  }

  export interface IPermissionsDAO {
    owner: string;
    ownerAccess: number;
    groups: Array<IPermissionGroupDAO>;
    otherAccess: number;
  }
}

export { default as Notifications } from './notification_collection';
export { default as Schedules } from './schedules_collection';
export { default as Achievements } from './achievements_collection';
// declare global {
//   export interface IMark {
//     value: string;
//     text: string;
//     title: string;
//   }
//
//   export interface IResult {
//     _id?: string;
//     tutorId: string;
//     student: string;
//     result: IMark[];
//     total: number;
//   }
// }
//
// export let Results: Mongo.Collection<IResult>;
// Results = new Mongo.Collection<IResult>('contents');
//
// Results.allow({
//   insert: function() { return true; },
//   update: function (userId, doc, fields, modifier) {
//     if (userId && doc.tutorId === userId) {
//       return true;
//     }
//   }
// });
