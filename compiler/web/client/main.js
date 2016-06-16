import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import App from '../imports/client/modules/core/components/app';

Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'));
});
