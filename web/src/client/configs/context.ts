import {Meteor} from 'meteor/meteor';
import store from './store';
import * as Collections from '../../lib/collections';
import { __ } from 'i18n-client';

import { UiUtils, RouterUtils, ClassUtils } from '../utils/helpers_client';
// import classnames from 'classnames';
// import beautify from "js-beautify";
// import StringUtils from "../../common/utils/string_utils";

const Utils = {
  Ui: UiUtils,
  Router: RouterUtils,
  Class: ClassUtils,
//  Css: classnames,
//  String: StringUtils,
//  Beautify: beautify
};

export default function () {
  return {
    Meteor,
    Store: store,
    Collections,
    Utils
  };
}

// global type defintions

declare global {
  export var mf: typeof __;
  export interface IContext {
    Collections: typeof Collections;
    Meteor?: typeof Meteor | any;
    Store?: IStore;
    Utils: typeof Utils
  }

  export interface IContainerContext {
    (): IContext;
  }

  export interface IComponentContext {
    context: IContext;
  }
}
