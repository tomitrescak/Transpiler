import { Mongo } from 'meteor/mongo';

declare global {
  export interface ISitesEmailSettings {
    // server: string;
    // user: string;
    // password: string;
    from: string;
  }

  export interface ISitesAccountsSettings {
    // from: string;
    subject: string;
    body: string;
  }

  export interface ISitesCommentsSettings {
    subject: string;
    body: string;
  }

  export interface ISitesConfigurationDAO extends IAccessSchema {
    siteName: string;
    defaultSite: string;
    uploadDir: string;
    email: ISitesEmailSettings;
    accounts: ISitesAccountsSettings;
    comments: ISitesCommentsSettings;
    activeGroups: string[];
    inactiveGroups: string[];
    maintenance?: boolean;
  }
}

// import { Roles } from 'meteor/alanning:roles';
//
// import { SchemaHelpers } from './schemas/schema_helpers';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
//
// // export interface IGroupDAO extends IAccessSchema {
// //   name: string;
// //   visible: boolean;
// //   type?: number;
// // }
//
// // schema
//
// let SitesEmailSchema = new SimpleSchema({
//   // server: {
//   //   type: String
//   // },
//   // user: {
//   //   type: String,
//   //   optional: true
//   // },
//   // password: {
//   //   type: String,
//   //   optional: true
//   // },
//   from: {
//     type: String
//   }
// });
//
// let SitesAccountSchema = new SimpleSchema({
//   // from: {
//   //   type: String
//   // },
//   subject: {
//     type: String
//   },
//   body: {
//     type: String
//   }
// });
//
// let SitesCommentSchema = new SimpleSchema({
//   subject: {
//     type: String
//   },
//   body: {
//     type: String
//   }
// });
//
// let schema = SchemaHelpers.addAccessSchema({
//   siteName: {
//     type: String
//   },
//   defaultSite: {
//     type: String
//   },
//   uploadDir: {
//     type: String
//   },
//   email: {
//     type: SitesEmailSchema
//   },
//   accounts: {
//     type: SitesAccountSchema
//   },
//   comments: {
//     type: SitesCommentSchema
//   },
//   maintenance: {
//     type: Boolean,
//     optional: true
//   },
//   activeGroups: {
//     type: [String],
//     optional: true
//   },
//   inactiveGroups: {
//     type: [String],
//     optional: true
//   }
// });

export let Configuration: Mongo.Collection<ISitesConfigurationDAO> = new Mongo.Collection<ISitesConfigurationDAO>('siteConfiguration');
// Configuration.attachSchema(schema);
//
// Configuration.allow({
//   insert: (userId: string) => Roles.userIsInRole(userId, ['admin']),
//   update: (userId: string) => Roles.userIsInRole(userId, ['admin']),
//   remove: (userId: string) => Roles.userIsInRole(userId, ['admin'])
// });

export default Configuration;
