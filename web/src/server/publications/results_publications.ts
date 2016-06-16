import { Meteor } from 'meteor/meteor';
import { Results } from '../../lib/collections';
import { check } from 'meteor/check';

export default function() {
  Meteor.publish('results', function() {
    return Results.find({ tutorId: this.userId });
  });
}
