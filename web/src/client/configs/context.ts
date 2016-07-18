import {Meteor} from 'meteor/meteor';
import store from './store';
import * as Collections from '../../lib/collections/collections';
import { __ } from 'i18n-client';
import { query, mutation } from 'meteor/tomi:apollo-mantra';

import { UiUtils, RouterUtils, ClassUtils } from '../utils/helpers_client';
import { mutationWithFeedback, addInsertData, addModificationData } from '../helpers/apollo_helpers';

import Config from './config';
import gql from 'graphql-tag';

// put it in the global scope for now
global.gql = gql;

// import classnames from 'classnames';
// import beautify from "js-beautify";
// import StringUtils from "../../common/utils/string_utils";

const Apollo = {
  query,
  mutation,
  mutationWithFeedback,
  addModificationData,
  addInsertData
};

const Utils = {
  Ui: UiUtils,
  Router: RouterUtils,
  Class: ClassUtils,
  //  Css: classnames,
  //  String: StringUtils,
  //  Beautify: beautify
};

export default function() {
  return {
    Meteor,
    Store: store,
    Collections,
    Utils,
    Config,
    Apollo
  };
}

// global type defintions

declare global {

  export interface IContext {
    Collections: typeof Collections;
    Meteor?: typeof Meteor | any;
    Store?: IStore;
    Utils: typeof Utils;
    Config: typeof Config;
    Apollo: typeof Apollo;
  }

  export interface IContainerContext {
    (): IContext;
  }

  export interface IComponentContext {
    context: IContext;
  }
}
