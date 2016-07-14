import { Mongo } from 'meteor/mongo';

declare global {
  export interface ICommentDAO {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    message: string;
    sent: Date;
  }

  export interface ISubmissionDAO {
    date: Date;
    files: ITextFileDAO[];
  }

  export interface ISolutionDAO extends IAccessSchema {
    _id?: string;
    scheduleId: string;
    practicalId: string;
    exerciseId: string;
    tutorId: string;
    tutorName: string;
    files: ITextFileDAO[];
    comments?: ICommentDAO[];
    status?: string;
    validated?: boolean;
    codeStars?: number;
    linesOfCode?: number;
    steps?: number;
    stepsStars?: number;
    mark?: number;
    rank?: number;
    locRank?: number;
    stepsRank?: number;
    submission?: ISubmissionDAO;
    compilationRunning?: boolean;
    compilationError?: boolean;
    compilationResult?: string;
  }
}

// import { SchemaHelpers } from "./schemas/schema_helpers";
// import { TextFileSchema } from "./schemas/text_file";
// import { SimpleSchema } from "meteor/aldeed:simple-schema";
//
// let CommentSchema = new SimpleSchema({
//   id: {
//     type: String
//   },
//   senderId: {
//     type: String
//   },
//   senderName: {
//     type: String
//   },
//   senderAvatar: {
//     type: String,
//     optional: true
//   },
//   message: {
//     type: String
//   },
//   sent: {
//     type: Date
//   }
// });
//
// let SubmissionSchema = new SimpleSchema({
//   date: {
//     type: Date
//   },
//   files: {
//     type: [TextFileSchema]
//   }
// });
//
// let SolutionSchema = SchemaHelpers.addAccessSchema({
//   scheduleId: {
//     type: String
//   },
//   practicalId: {
//     type: String
//   },
//   exerciseId: {
//     type: String
//   },
//   tutorId: {
//     type: String
//   },
//   tutorName: {
//     type: String
//   },
//   files: {
//     type: [TextFileSchema]
//   },
//   status: {
//     type: String
//   },
//   validated: {
//     type: Boolean
//   },
//   comments: {
//     type: [CommentSchema]
//   },
//   codeStars: {
//     type: Number,
//     optional: true
//   },
//   linesOfCode: {
//     type: Number,
//     optional: true
//   },
//   steps: {
//     type: Number,
//     optional: true
//   },
//   stepsStars: {
//     type: Number,
//     optional: true
//   },
//   mark: {
//     type: Number,
//     optional: true,
//     decimal: true
//   },
//   submission: {
//     type: SubmissionSchema,
//     optional: true
//   },
//   rank: {
//     type: Number,
//     optional: true
//   },
//   locRank: {
//     type: Number,
//     optional: true,
//     decimal: true
//   },
//   stepsRank: {
//     type: Number,
//     optional: true,
//     decimal: true
//   }
// });
//
// // export interface ICommentDAO {
// //   id: string;
// //   senderId: string;
// //   senderName: string;
// //   senderAvatar: string;
// //   message: string;
// //   sent: Date;
// // }
//
// // export interface ISolutionDAO extends IAccessSchema {
// //   _id?: string;
// //   scheduleId: string;
// //   practicalId: string;
// //   exerciseId: string;
// //   tutorId: string;
// //   tutorName: string;
// //   files: ITextFileDAO[];
// //   status: string;
// //   validated: boolean;
// //   comments: ICommentDAO[];
// //   codeStars: number;
// //   linesOfCode: number;
// //   steps: number;
// //   stepsStars: number;
// //   mark: number;
// //   rank?: number;
// //   locRank?: number;
// //   stepsRank?: number;
// //   submission?: ISubmissionDAO;
// // }

export let Solutions = new Mongo.Collection<ISolutionDAO>('solutions');
// Solutions.attachSchema(SolutionSchema);

export default Solutions;

  // //Collection2 already does schema checking
  // //Add custom permission rules if needed
  // if (Meteor.isServer) {
  //   Solutions.allow({
  //     insert: (userId) => true,
  //     update: (userId, doc) => true,
  //     remove: (userId) => Roles.userIsInRole(userId, ["admin"])
  //   });
  // }
// }
