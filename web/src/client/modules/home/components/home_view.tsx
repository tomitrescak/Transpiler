import React from 'react';
import Helmet from 'react-helmet';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Grid, Column, Segment, Image } from 'semanticui-react';
import Jumbo from './jumbo_view';

import jss from '../../../configs/jss';

import SchedulesView from '../../schedules/containers/schedule_list_container';
import NotificationsView from '../../notifications/containers/notification_container';
// import Announcements from '../../announcements/containers/announcements_container';

import { AccountsView } from 'meteor/tomi:accountsui-semanticui-redux';


// styles

const css = jss({
  container: {
    'padding-bottom': '5rem',
    '& .information': {
      margin: '5em 1em 1em 0em'
    },
    '& .clara': {
      position: 'absolute!important',
      left: '0%',
      bottom: '-120px',
      'z-index': 1000
    },
    '& h1': {
        'font-size': '3em!important',
        'margin-bottom': '1em!important'
    },
    '& .login': {
      'margin-top': '60px'
    }
  }
});

// component

interface IProps extends IAuthContainerProps {
}

export default class Home extends React.Component<IProps, {}> {
  enter() {
    $('.masthead .jumbo').transition('scale out', 200, function() {
      $('.masthead .login').transition('scale in', 500);
    });
  }

  render() {
    return (
      <div className={css.container}>
        <Helmet title="Home" />
        <If condition={this.props.user}>
          <div>
            {/* LOGGED IN */}
            <Grid stackable columns={2}>
              <Column width={9}>
                {/*<Announcements />*/}

                <SchedulesView icon="calendar" header="schedules.label" route="schedule" showBadges={true} />
              </Column>
              <Column width={7}>
                <Segment>
                  <NotificationsView />
                </Segment>
              </Column>
            </Grid>
          </div>
        <Else />
          <Grid stackable columns={2}>
            <Column width={6} classes="computer only tablet only">
              <Image size="medium" classes="clara" src="/images/clara.png" />
            </Column>
            <Column width={10}>
              <Jumbo loggingIn={this.props.loggingIn} enter={this.enter} />
              <div id="login" className="ui hidden transition login">
                <AccountsView />
              </div>
            </Column>
          </Grid>
        </If>
      </div>
    );
  }

  componentDidMount() {
    if (Accounts['_resetPasswordToken']) {
      setTimeout(function() { $('#enterWorld').click(); }, 1000);
    };

    if (Meteor.user() != null || Accounts['_verifyEmailToken'] != null) {
      $('.masthead .login').transition('scale in', 1000);
    } else {
      $('.masthead .jumbo').transition('scale in', 1000);
    }
  }
}
