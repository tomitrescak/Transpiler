///////////////////////////////////////////////////////////////
// Node.js                                                   //
///////////////////////////////////////////////////////////////

declare var global: any;
declare var module: any;
declare function require(mod: string): any;
declare var process: any;

// ///////////////////////////////////////////////////////////////
// // react-router                                  //
// ///////////////////////////////////////////////////////////////
//
// declare module 'react-router' {
//   export var browserHistory: any;
// }

///////////////////////////////////////////////////////////////
// react-router-redux                                        //
///////////////////////////////////////////////////////////////

declare module 'react-dom' {
  export function render(...params: any[]): any;
}

///////////////////////////////////////////////////////////////
// react-router-redux                                        //
///////////////////////////////////////////////////////////////

declare module 'react-router-redux' {
  export function syncHistoryWithStore(history: any, store: any): any;
  export var routerReducer: any;
}


///////////////////////////////////////////////////////////////
// react-mounter                                             //
///////////////////////////////////////////////////////////////

declare module 'react-mounter' {
  export var mount: any;
  export var withOptions: any;
}

///////////////////////////////////////////////////////////////
// mantra                                                    //
///////////////////////////////////////////////////////////////

import React = __React;

declare module 'mantra-core' {
  interface IKomposer {
    (params: Object, onData: Function): Function;
  }

  interface IKomposerData<T> {
    (error?: Object, data?: T): void;
  }

  interface IInjectDeps {
    (...deps: any[]): IInjectDeps;
  }

  interface IDepsMapper {
    (...deps: any[]): void;
  }

  export var injectDeps: IInjectDeps;
  export function useDeps(depsMapper?: IDepsMapper): any;
  export function createApp(context: any): any;

  export function compose(komposer: IKomposer, loadingComponent?: any, bim?: any, opts?: { pure: Boolean }): any;
  export function composeWithTracker(komposer: IKomposer, loadingComponent?: any, bim?: any, opts?: { pure: Boolean }): any;
  export function composeWithPromise(): any;
  export function composeWithObservable(): any;
  export function composeAll<V>(...composeFunctions: Function[]):
    (component: any, loadingComponent?: any) => () => React.Component<V, {}>;
}

///////////////////////////////////////////////////////////////
// storybook                                                 //
///////////////////////////////////////////////////////////////

declare module '@kadira/storybook' {
  export var storiesOf: any;
  export var action: any;
}

///////////////////////////////////////////////////////////////
// react-hot-loader                                          //
///////////////////////////////////////////////////////////////

declare module 'react-hot-loader' {
  export var AppContainer: any;
}

///////////////////////////////////////////////////////////////
// redbox-react                                              //
///////////////////////////////////////////////////////////////

declare module 'redbox-react' {
  let Alert: any;
  export default Alert;
}

///////////////////////////////////////////////////////////////
// apollo                                                    //
///////////////////////////////////////////////////////////////

declare module 'meteor/apollo' {
  interface ServerProperties {
    schema: any;
    formatError?: Function;
    graphiql?: Boolean;
    pretty?: Boolean;
    validationRules?: Array<any>;
    context?: any;
    rootValue?: any;

    // Apollo options
    resolvers?: Object;
    connectors?: Object;
    mocks?: Object;
    printErrors?: Boolean;
    allowUndefinedInResolve?: Boolean;
  }
  export function createApolloServer(options: ServerProperties): void;
}

declare module 'apollo-client' {
  export var Document: any;
  export var GraphQLResult: any;
  export var SelectionSet: any;
  export var GraphQLError: any;
  export var ApolloClient: any;
  export var createNetworkInterface: any;
  export default ApolloClient;
}

declare var gql: any;

declare module 'react-apollo' {
  export var ApolloProvider: any;
  export var connect: any;
}

declare module 'apollo-client/gql' {
  export var registerGqlTag: any;
}

declare module 'graphql-tools' {
  export var apolloServer: any;
}

declare module 'express' {
  let express: any;
  export default express;
}

declare module 'http-proxy-middleware' {
  let proxyMiddleware: any;
  export default proxyMiddleware;
}

declare module 'redux-thunk' {
  let thunk: any;
  export default thunk;
}

declare module 'redux-logger' {
  let logger: any;
  export default logger;
}

///////////////////////////////////////////////////////////////
// jss                                                       //
///////////////////////////////////////////////////////////////

declare module 'jss' {
  interface IJss {
    use(plugin: any): void;
    createStyleSheet(sheet: any): any;

  }
  let jss: IJss;
  export default jss;
}

declare module 'jss-nested' {
  export default function(): any;
}

///////////////////////////////////////////////////////////////
// meteor packages                                           //
///////////////////////////////////////////////////////////////

declare module 'meteor/didstopia:admzip' {
  export var extractZip: any;
}

///////////////////////////////////////////////////////////////
// react-s-alert                                             //
///////////////////////////////////////////////////////////////


declare module 'react-s-alert' {
  export default class SAlertStatic extends __React.Component<{}, {}> {
    success(message: string, options?: Object): void;
    info(message: string, options?: Object): void;
    error(message: string, options?: Object): void;
    config(config: Object): void;
  }

  // let Alert: SAlertStatic;
  // export default Alert;
}


///////////////////////////////////////////////////////////////
// i18n-client                                               //
///////////////////////////////////////////////////////////////

interface I18n {
  languages: Object;
  currentLanguage: string;
  add(language: string, strings: Object): void;
  initTranslator(prefix: string): void;
  translate(key: string, args?: any): string;
}

declare module 'i18n-client' {
  export var i18n: I18n;
  export function __(key: string, args?: any): string;
}

///////////////////////////////////////////////////////////////
// meteor/tomi:accountsui-semanticui-redux                   //
///////////////////////////////////////////////////////////////

declare module 'meteor/tomi:accountsui-semanticui-redux' {
  export class AccountsView extends __React.Component<{}, {}> { }
  export class UserView extends __React.Component<{}, {}> { }
  export function reducer(state: any, action: any): any;

  export interface AccountsUiUser {
    _id: string;
    profile: any;
    isRole(role: string | string[]): boolean;
    isAdmin(): boolean;
  }

  interface IState {
    view?: string;
    error?: string;
    info?: string;
    token?: string;
    user?: any;
    loggingIn?: boolean;
  }
}

///////////////////////////////////////////////////////////////
// marked                                                    //
///////////////////////////////////////////////////////////////

declare module 'marked' {
  export var marked: Function;
  export default marked;
}

///////////////////////////////////////////////////////////////
// moment                                                    //
///////////////////////////////////////////////////////////////

declare module 'moment' {
  export var moment: Function;
  export default moment;
}

///////////////////////////////////////////////////////////////
// pickadate                                                 //
///////////////////////////////////////////////////////////////

declare interface JQuery {
  pickadate(props: any): void;
}

///////////////////////////////////////////////////////////////
// meteor extras                                             //
///////////////////////////////////////////////////////////////

declare module 'meteor/meteor' {
  export module Meteor {
    interface AsyncCallback { (error: Meteor.Error, result: any): void }
  }
}

///////////////////////////////////////////////////////////////
// semantic ui                                               //
///////////////////////////////////////////////////////////////

interface JQuery {
  form(formDefinition: any, options: any): any;
  dropdown(...params: any[]): void;
  transition(name: string, duration: number, callback?: () => void): any;
  sticky(options: any): any;
  search(options: Object): any;
  modal(text: any): JQuery;
  tab(): any;
  checkbox(): any;
  popup(): any;
  sidebar(...params: any[]): any;
}

interface JQueryStatic {
  semanticUiGrowl(text: string, params?: Object): any;
}

///////////////////////////////////////////////////////////////
// Sweet alert                                               //
///////////////////////////////////////////////////////////////

declare module 'sweetalert' {
  export default function swal(...any: any[]): void;
}

///////////////////////////////////////////////////////////////
// jsx-control-statements                                    //
///////////////////////////////////////////////////////////////

declare function If (condition: any): any;
declare function For(each: string, index: string, of: any): any;
declare var Else: any;
