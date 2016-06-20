import { Mongo } from 'meteor/mongo';

declare global {
  export interface ICodeHistoryDAO {
      solutionId: string;
      delta: string;
      date: Date;
  }
}

// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
//
// let HistorySchema = new SimpleSchema({
//   solutionId: {
//     type: String
//   },
//   delta: {
//     type: String
//   },
//   date: {
//     type: Date
//   }
// });

export let History = new Mongo.Collection<ICodeHistoryDAO>('history');
//History.attachSchema(HistorySchema);

export default History;
