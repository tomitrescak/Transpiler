import ApolloClient from 'apollo-client';

export const client = new ApolloClient();
console.log('Init apollo: ' + client)

export default client;
