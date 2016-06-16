import React from 'react';
import Helmet from 'react-helmet';
import Header from '../containers/header_container';

const Layout = (props: any) => (
  <div className="app">
    <Helmet titleTemplate="Mantra - %s" />
    <Header />
    <div className="ui page grid">
      <div className="column">
        { props.children }
      </div>
    </div>

  </div>
);

export default Layout;
