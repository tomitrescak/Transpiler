import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

declare global {
  export interface ILinesOfCodeDAO {
    cheatDetection: number;
    oneStar: number;
    twoStars: number;
    threeStars: number;
  }

  export interface IBoardValidationDAO {
    boards: IBoardDAO[];
    input: string[];
    output: string[];
    checkPosition: boolean;
  }

  export interface IStepsStarsDAO {
    oneStar: number;
    twoStars: number;
  }

  export interface IBoardDAO {
    validations?: IBoardValidationDAO[];
    rows: number;
    columns: number;
    worldId: string;
    stars: IStepsStarsDAO;
    wrap: boolean;
    tiles: number[][];
  }

  /**
   * @interface IExerciseDAO
   */
  export interface IExerciseDAO extends IAccessSchema {
    _id?: string;
    name: string;
    description: string;
    points: number;
    difficulty: number;
    linesOfCode: ILinesOfCodeDAO;
    worldId: string;
    image: string;
    allowedCommands: string;
    files: ITextFileDAO[];
    boards: IBoardDAO[];
    images: string[];
    permissions: IPermissionsDAO;
    protectLoops: boolean;
  }
}

// import { PermissionSchema } from "./schemas/permission_schema";
// import { SchemaHelpers } from "./schemas/schema_helpers";
// import { TextFileSchema } from "./schemas/text_file";
// import { Security } from "../models/security_model";

// import { SimpleSchema } from "meteor/aldeed:simple-schema";
//
// // module Hugo.Collections {
//
// let BoardStarSchema = new SimpleSchema({
//   oneStar: {
//     type: Number
//   },
//   twoStars: {
//     type: Number
//   }
// });
//
// let BoardBaseSchema = new SimpleSchema({
//   rows: {
//     type: Number
//   },
//   columns: {
//     type: Number
//   },
//   wrap: {
//     type: Boolean
//   },
//   worldId: {
//     type: String
//   },
//   tiles: {
//     type: [[Number]]
//   },
//   stars: {
//     type: BoardStarSchema,
//     optional: true
//   }
// });
//
// let ValidationSchema = new SimpleSchema({
//   boards: {
//     type: [BoardBaseSchema],
//     optional: true
//   },
//   input: {
//     type: [String],
//     optional: true
//   },
//   output: {
//     type: [String],
//     optional: true
//   },
//   checkPosition: {
//     type: Boolean,
//     optional: true
//   }
// });
//
// let BoardSchema = new SimpleSchema([BoardBaseSchema, {
//   validations: {
//     type: [ValidationSchema],
//     optional: true
//   }
// }]);
//
// let LinesOfCodeSchema = new SimpleSchema({
//   cheatDetection: {
//     type: Number,
//     optional: true
//   },
//   oneStar: {
//     type: Number
//   },
//   twoStars: {
//     type: Number
//   },
//   threeStars: {
//     type: Number
//   }
// });
//
// // adds createdAt, updatedAt ...
// export let exerciseSchema = SchemaHelpers.addAccessSchema({
//   name: {
//     type: String
//   },
//   description: {
//     type: String,
//     optional: true
//   },
//   points: {
//     type: Number,
//     optional: true,
//     decimal: true
//   },
//   allowedCommands: {
//     type: String,
//     optional: true
//   },
//   difficulty: {
//     type: Number,
//     optional: true
//   },
//   linesOfCode: {
//     type: LinesOfCodeSchema,
//     optional: true
//   },
//   world: {
//     type: String,
//     optional: true
//   },
//   worldId: {
//     type: String,
//     optional: true
//   },
//   images: {
//     type: [String],
//     optional: true
//   },
//   image: {
//     type: String,
//     optional: true
//   },
//   boards: {
//     type: [BoardSchema],
//     optional: true
//   },
//   files: {
//     type: [TextFileSchema],
//     optional: true
//   },
//   permissions: {
//     type: PermissionSchema,
//     optional: true
//   },
//   protectLoops: {
//     type: Boolean,
//     optional: true
//   }
// });

export let Exercises: Mongo.Collection<IExerciseDAO> = new Mongo.Collection<IExerciseDAO>("exercises");
// Exercises.attachSchema(exerciseSchema);

// if (Meteor.isServer) {
//   Exercises.allow({
//     insert: (userId: string, doc: any) => Security.canWrite(userId, doc),
//     update: (userId: string, doc: any) => Security.canWrite(userId, doc),
//     remove: (userId: string, doc: any) => Security.canWrite(userId, doc)
//   });
// }

export default Exercises;
