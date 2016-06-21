import { createApolloServer } from 'meteor/apollo';
import { Meteor } from 'meteor/meteor';
import { schemas, resolvers } from 'apollo-mantra';
import createSchemas from '../data/schemas/index';

declare global {
  export interface IApolloContext {
    user: Meteor.User;
    userId: string;
  }
}

export default function() {
  createSchemas();

  // console.log('creating server ...: ' + JSON.stringify(schema));

  createApolloServer({
    graphiql: true,
    pretty: true,
    schema: schemas(),
    resolvers: resolvers(),
  });
}
