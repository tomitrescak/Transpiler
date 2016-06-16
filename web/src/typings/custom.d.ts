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

  export function compose(komposer: IKomposer, loadingComponent?: any, bim?: any, opts?: { pure: Boolean}): any;
  export function composeWithTracker(komposer: IKomposer, loadingComponent?: any, bim?: any, opts?: { pure: Boolean}): any;
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
    schema: any,
    formatError?: Function, // optional
    graphiql?: Boolean, // optional
    pretty?: Boolean, // optional
    validationRules?: Array<any>, // optional
    context?: any, // optional
    rootValue?: any // optional

    // Apollo options
    resolvers?: Object, // required if schema is an array of type definitions
    connectors?: Object, // optional
    mocks?: Object, // optional
    printErrors?: Boolean, // optional
    allowUndefinedInResolve?: Boolean, // optional
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
// tomi:accountsui-semanticui-redux                          //
///////////////////////////////////////////////////////////////

declare module 'meteor/tomi:accountsui-semanticui-redux' {
  export class AccountsView extends __React.Component<{}, {}> {}
  export class UserView extends __React.Component<{}, {}> {}
  export function reducer(state: any, action: any): any;

  interface IState {
    view?: string;
    error?: string;
    info?: string;
    token?: string;
    user?: any;
  }
}
