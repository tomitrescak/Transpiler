import React from 'react';

import Helmet from 'react-helmet';
import {Link} from 'react-router';

import { AccountsView } from 'meteor/tomi:accountsui-semanticui-redux';
import Marking from '../../marking/components/marking_view';

const HomePage = ({ user, params }: any) => {
  return (
    <div>
      <Helmet title="Marking" />
      { user ? <Marking id={params.id} /> :  <AccountsView /> }
    </div>
  );
};

export default HomePage;
