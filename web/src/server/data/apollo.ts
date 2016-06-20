interface IApolloDefinition {
  schema: string;
  queries?: Object;
  resolvers?: Object;
  mutations?: Object;
  queryText?: string;
  mutationText?: string;
}

let queries = '';
let mutations = '';

export const schema: any[] = [];
export const resolvers = {
  RootQuery: {},
  // RootMutation: {}
};

function process(apolloDefinitions: IApolloDefinition[]) {
  for (let apolloDefinition of apolloDefinitions) {
    if (apolloDefinition.schema) {
      schema.push(apolloDefinition.schema);
    }

    if (apolloDefinition.queries) {
      Object.assign(resolvers.RootQuery, apolloDefinition.queries);
    }

    // if (apolloDefinition.mutations) {
    //   Object.assign(resolvers.RootMutation, apolloDefinition.mutations);
    // }

    if (apolloDefinition.resolvers) {
      Object.assign(resolvers, apolloDefinition.resolvers);
    }

    if (apolloDefinition.queryText) {
      queries += apolloDefinition.queryText + '\n';
    }

    if (apolloDefinition.mutationText) {
      mutations += apolloDefinition.mutationText + '\n';
    }
  }

  // add all the queries and mutations

  queries = `
  type RootQuery {
    ${queries}
  }
  `;
  schema.push(queries);

  // mutations = `
  // type RootMutation {
  //   ${queries}
  // }
  // `;
  // schema.push(mutations);
}

// process all

import notifications from './schemas/notifications_schema';
import common from './schemas/common_schema';
import permissions from './schemas/permission_schema';
import schedule from './schemas/schedule_schema';
import root from './schemas/root_schema';

process([
  notifications,
  common,
  permissions,
  schedule,
  root
]);
