// module Hugo.Collections {
// import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { Mongo } from 'meteor/mongo';

declare global {
  export enum AchievementType {
    LocMaxStars,
    StepsMaxStars,
    BestExercise,
    BestPractical,
    BestSchedule,
    Speed,
    LocMaster,
    OptimisationMaster
  }

  /**
   * @interface IExerciseDAO
   */
  export interface IAchievementsDAO extends IAccessSchema {
    userId: string;
    scheduleId: string;
    practicalId?: string;
    exerciseId?: string;
    locRank?: number;
    type: AchievementType;
    rank: number;
    count?: number;
    solutions?: string[];
    descriptions?: string[];
  }
}

export enum AchievementType {
  LocMaxStars,
  StepsMaxStars,
  BestExercise,
  BestPractical,
  BestSchedule,
  Speed,
  LocMaster,
  OptimisationMaster
}

// let achievementsSchema = new SimpleSchema({
//   userId: {
//     type: String
//   },
//   scheduleId: {
//     type: String
//   },
//   type: {
//     type: Number
//   },
//   rank: {
//     type: Number,
//     optional: true
//   },
//   count: {
//     type: Number,
//     optional: true
//   },
//   solutions: {
//     type: [String],
//     optional: true
//   },
//   descriptions: {
//     type: [String],
//     optional: true
//   }
// });

export let Achievements: Mongo.Collection<IAchievementsDAO> = new Mongo.Collection<IAchievementsDAO>('achievements');
export default Achievements;
