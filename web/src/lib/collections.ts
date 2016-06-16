import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

declare global {
  export interface IMark {
    value: string;
    text: string;
    title: string;
  }

  export interface IResult {
    _id?: string;
    tutorId: string;
    student: string;
    result: IMark[];
    total: number;
  }
}

export let Results: Mongo.Collection<IResult>;
Results = new Mongo.Collection<IResult>('contents');

Results.allow({
  insert: function() { return true; },
  update: function (userId, doc, fields, modifier) {
    if (userId && doc.tutorId === userId) {
      return true;
    }
  }
});
