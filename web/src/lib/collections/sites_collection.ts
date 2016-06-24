import { Mongo } from 'meteor/mongo';

declare global {
  export interface ISiteAdmin {
    _id: string;
    email: string;
    name: string;
  }

  export interface ISiteConfigurationDAO extends IAccessSchema {
    name: string;
    description?: string;
    welcomeText?: string;
    cssStyle?: string;
    theme?: string;
    accounts: string[];
    activeGroups: string[];
    inactiveGroups: string[];
    admins: ISiteAdmin[];
    permissions?: IPermissionsDAO;
  }
}

// import { Roles } from 'meteor/alanning:roles';
//
// import { SchemaHelpers } from './schemas/schema_helpers';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
//
// let SiteAdminSchema = new SimpleSchema({
//   _id: {
//     type: String
//   },
//   email: {
//     type: String
//   },
//   name: {
//     type: String
//   }
// });
//
// let siteSchema = SchemaHelpers.addAccessSchema({
//   name: {
//     type: String
//   },
//   description: {
//     type: String,
//     optional: true
//   },
//   welcomeText: {
//     type: String,
//     optional: true
//   },
//   cssStyle: {
//     type: String,
//     optional: true
//   },
//   theme: {
//     type: String,
//     optional: true
//   },
//   activeGroups: {
//     type: [String]
//   },
//   inactiveGroups: {
//     type: [String]
//   },
//   admins: {
//     type: [SiteAdminSchema]
//   },
//   accounts: {
//     type: [String]
//   }
// 	// ,
//   // permissions: {
//   //   type: PermissionSchema
//   // }
// });

export let Sites: Mongo.Collection<ISiteConfigurationDAO> = new Mongo.Collection<ISiteConfigurationDAO>('sites');
// Sites.attachSchema(siteSchema);
//
// Sites.allow({
//   insert: (userId: string) => Roles.userIsInRole(userId, ['admin']),
//   update: (userId: string) => Roles.userIsInRole(userId, ['admin']),
//   remove: (userId: string) => Roles.userIsInRole(userId, ['admin'])
// });

export default Sites;
