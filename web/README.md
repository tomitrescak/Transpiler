# Installation

1. First install npm modules for React, Redux, Apollo, React-Router

  ```
  npm i --save react react-dom
  npm i --save redux react-redux redux-thunk
  npm i --save react-router react-router-redux
  npm i --save apollo-client graphql-tools express http-proxy-middleware
  npm i --save mantra-core
  npm i --save react-helmet

  npm i --save-dev chai-enzyme chai enzyme
  ```

1. Setup hot reloading

  ```
  meteor remove ecmascript
  meteor add gadicc:ecmascript-hot
  npm i --save-dev babel-preset-meteor
  npm i --save react-hot-loader@^3.0.0-beta.2
  npm i --save-dev redbox-react
  ```

  Add following `.babelrc` to the root of your application

  ```json
  {
    "presets": [
      "meteor"
    ],
    "plugins": [ "react-hot-loader/babel" ]
  }
  ```

  Make sure that your `client.js` file in your client directory contains following line:

  ```javascript
  import 'react-hot-loader/patch';`
  ```

1. Install dev dependencies

  ```
  npm i --save-dev eslint eslint-plugin-babel eslint-plugin-react
  ```

1. Remove ugly packages, setup your `.meteor/packages` as following

  ```
  meteor-base             # Packages every Meteor app needs to have
  mongo                   # The database Meteor supports right now

  standard-minifier-css   # CSS minifier run for production mode
  standard-minifier-js    # JS minifier run for production mode
  es5-shim                # ECMAScript 5 compatibility for older browsers.

  gadicc:ecmascript-hot
  ```

1. Install typings in `src` directory

  ```
  typings install env~meteor --global --save
  typings install dt~react --global
  typings install npm~redux --save
  typings install npm~react-redux --save
  typings install npm~react-router --save
  typings install npm~chai-enzyme --save
  typings install npm~enzyme --save
  typings install npm~chai --save
  ```

1. Create custom typings, which do not exist in typings registry or simplify complex modules such as node.js

  Source:


1. Create following config files:

  1. `tslint.json` from https://gist.github.com/tomitrescak/8866b3020d944afa0bd8b3ce7a626e3f
  2. `.eslintrc` from https://gist.github.com/tomitrescak/3ee861a55fc55be09276537564569199
  3. `tsconfig.json` in `src` directory https://gist.github.com/tomitrescak/844a9d909d1bf328303118c1aa49f36d
  4. `.jsbeautifyrc` from https://gist.github.com/tomitrescak/f28515f00c7e383cf042a00eabcaf865


# Redux

In this part we setup redux store and reducers

1. Setup your application's configs

  ```
  mkdir -p src/client/configs
  ```

  Setup store with redux tools

  ```javascript
  // file: src/client/configs/store.ts
  import { createStore, compose, applyMiddleware } from 'redux';
  import { syncHistoryWithStore} from 'react-router-redux';
  import { browserHistory } from 'react-router';
  import reduxThunk from 'redux-thunk';

  // import the root reducer
  import rootReducer from './reducers';

  // create an object for the default data
  const defaultState = {};

  const middleware = [reduxThunk]; // will add apolloClient.middleware()

  const enhancers = compose(
    applyMiddleware(...middleware),
    window['devToolsExtension'] ? window['devToolsExtension']() : f => f
  );

  const store = createStore(rootReducer, defaultState, enhancers);

  export const history = syncHistoryWithStore(browserHistory, store);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  export default store;

  // typescript typings

  declare global {
    export interface IStore {
    }
  }
  ```

  Top level reducers

  ```javascript
  // file: src/client/configs/reducers.ts
  // here we import all reducers from modules
  // this is the root for all reducers so that we can hot reload them

  import { combineReducers } from 'redux';
  import { routerReducer } from 'react-router-redux';

  // import all other reducers
  // import ...

  const rootReducer = combineReducers({ routing: routerReducer });

  export default rootReducer;

  // typescript types holding all action creators

  declare global {
    export interface IActions {
    }
  }
  ```

  # Mantra

  Initialise mantra context

  ```javascript
  // file client/configs/contex.js
  import {Meteor} from 'meteor/meteor';
  import store from './store';

  export default function () {
    return {
      Meteor,
      Store: store
    };
  }

  // global type defintions

  declare global {
    export interface IContainerContext {
      (): IContext;
    }

    export interface IContext {
      Meteor?: typeof Meteor | any;
      Store?: IStore;
    }
  }
  ```

  Setup accounts

  ```javascript
  // file client/configs/accounts.ts
  import { Accounts } from 'meteor/accounts-base';

  Accounts.ui.config({
    passwordSignupFields: 'EMAIL_ONLY',
  });
  ```

# Modules

## Core Module

We will setup only the module, layout, routes and actions

```javascript
// index.ts
import actions from './actions/index';
import routes from './routes';

export default {
  actions,
  routes
};
```

Time to setup routes, we will use `react-router-redux` to mount history into the store
Also, we define three basic components: Layout, Home and Profile

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';

// Components
import Layout from './components/layout';
import HomePage from './components/home';
import ProfilePage from '../user/components/profile';

export default function (inject: Function, {Store}: IContext) {
  const history = syncHistoryWithStore(browserHistory, Store);

  const LayoutCtx = inject(Layout);

  ReactDOM.render(
    <Provider store={Store}>
      <Router history={history}>
        <Route path="/" component={LayoutCtx}>
          <IndexRoute component={HomePage} />
          <Route path="profile" component={ProfilePage} />
        </Route>
      </Router>
    </Provider>,
    document.body
  );
};
```

Layout component

```javascript
import React from 'react';

import Helmet from 'react-helmet';

const Layout = (props: any) => (
  <div className="app">
    <Helmet
      titleTemplate="Mantra - %s"
      />
    { props.children }
  </div>
);

export default Layout;
```

Home component

```javascript
import React from 'react';

import Helmet from 'react-helmet';
import {Link} from 'react-router';

const HomePage = () => (
  <div className="home-page">
    <Helmet
      title="Home"
    />
    <div>Welcome Home!</div>
    <Link to="profile">Profile Page</Link>
  </div>
);

export default HomePage;
```

# Profile module

Component

```javascript
import React from 'react';

import Helmet from 'react-helmet';
import {Link} from 'react-router';

const ProfilePage = () => (
  <div className="profile-page">
    <Helmet
      title="Profile"
    />
    <div>Profile!</div>
    <Link to="/">Home Page</Link>
  </div>
);

export default ProfilePage;
```
