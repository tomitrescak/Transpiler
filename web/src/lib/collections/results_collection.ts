import { Mongo } from 'meteor/mongo';

declare global {
  export interface IResultsDAO {
      _id?: string;
      scheduleId: string;
      practicalId: string;
      exerciseId: string;
      solutionId: string;
      user: string;
      userName: string;
      userEmail: string;
      userRoles: string[];
      loc: number;
      locRank: number;
      locStars: number;
      steps: number;
      stepsStars: number;
      stepsRank: number;
      completed?: number;
      rank?: number;
  }
}

// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// let ResultsSchema = new SimpleSchema({
//   scheduleId: {
//     type: String
//   },
//   practicalId: {
//     type: String,
//     optional: true
//   },
//   exerciseId: {
//     type: String,
//     optional: true
//   },
//   solutionId: {
//     type: String,
//     optional: true
//   },
//   user: {
//     type: String
//   },
//   userName: {
//     type: String
//   },
//   userEmail: {
//     type: String
//   },
//   userRoles: {
//     type: [String],
//     optional: true
//   },
//   loc: {
//     type: Number
//   },
//   locRank: {
//     type: Number,
//     optional: true,
//     decimal: true
//   },
//   locStars: {
//     type: Number,
//     optional: true
//   },
//   steps: {
//     type: Number
//   },
//   stepsStars: {
//     type: Number,
//     optional: true
//   },
//   stepsRank: {
//     type: Number,
//     optional: true,
//     decimal: true
//   },
//   /*rank: {
//     type: Number,
//     optional: true
//   },*/
//   completed: {
//     type: Number,
//     optional: true
//   }
// });

export let Results = new Mongo.Collection<IResultsDAO>('results');
// Results.attachSchema(ResultsSchema);

export default Results;
