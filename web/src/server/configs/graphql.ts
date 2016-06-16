import { createApolloServer } from 'meteor/apollo';

import schema from '../data/schema';
import resolvers from '../data/resolvers';

export default function() {
  console.log('creating server ...');
  createApolloServer({
    graphiql: true,
    pretty: true,
    schema,
    resolvers,
  });
}
