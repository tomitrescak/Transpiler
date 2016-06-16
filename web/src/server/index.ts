import { Meteor } from 'meteor/meteor';

// graphiql

import configGraphQL from './configs/graphql';

import methods from './methods/index';
import publications from './publications/index';
import accounts from './configs/accounts';

configGraphQL();

accounts();

methods();
publications();
