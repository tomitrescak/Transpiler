import {Meteor} from 'meteor/meteor';
import store from './store';
import * as Collections from '../../lib/collections';

export default function () {
  return {
    Meteor,
    Store: store,
    Collections
  };
}

// global type defintions

declare global {
  export interface IContainerContext {
    (): IContext;
  }

  export interface IContext {
    Collections: typeof Collections;
    Meteor?: typeof Meteor | any;
    Store?: IStore;
  }
}
