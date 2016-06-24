import { Meteor } from 'meteor/meteor';
import ApolloClient from 'apollo-client';
import { meteorClientConfig } from 'meteor/apollo';
import { registerGqlTag } from 'apollo-client/gql';

//Meteor.startup(() => {
  registerGqlTag();
//});

declare global {
  export interface IGraphqlQuery {
    [name: string]: {
      query: any,
      forceFetch?: boolean,
      variables?: Object
    };
  }

  export interface IGraphQlProps<T> {
    state: IState;
    ownProps: T;
  }
}

export const client = new ApolloClient(meteorClientConfig());

export default client;
