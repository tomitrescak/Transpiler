import { createApolloServer } from 'meteor/apollo';
import { Meteor } from 'meteor/meteor';

import { schema, resolvers } from '../data/apollo';

declare global {
  export interface IApolloContext {
    user: Meteor.User;
    userId: string;
  }
}

export default function() {
  // console.log('creating server ...: ' + JSON.stringify(schema));

  createApolloServer({
    graphiql: true,
    pretty: true,
    schema,
    resolvers,
  });
}
