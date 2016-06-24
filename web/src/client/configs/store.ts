import { createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

// import the root reducer
import rootReducer from './reducers';

// apollo
import client from './apollo';

// create an object for the default data

const defaultState = {};

// middlewares

const middleware = [reduxThunk, client.middleware()]; // will add apolloClient.middleware()

// redux tool

const enhancers = compose(
  applyMiddleware(...middleware),
  window['devToolsExtension'] ? window['devToolsExtension']() : f => f
);

// initialise store

const store = createStore(rootReducer, defaultState, enhancers);

export default store;

// hot reload

if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers').default;
    store.replaceReducer(nextRootReducer);
  });
}
