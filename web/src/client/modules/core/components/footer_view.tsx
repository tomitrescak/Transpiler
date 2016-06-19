import * as React from 'react';
import { Segment, Grid, Column, Header5, List, ListItem } from 'semanticui-react';

import jss from '../../../configs/jss';

const css = jss({
  main: {
    'border-radius': '0px!important'
  }
});

const Footer = () => (
  <Segment inverted={true} classes={css.main}>
    <Grid classes="stackable center aligned page">
      <Column width={10}>
        <Grid columns={3} classes="center aligned stackable">
          <Column>
            <Header5 inverted={true} text="course.label" />
            <List inverted={true} link={true}>
              <ListItem key="cl" link="calendar" text="calendar.label" />
              <ListItem key="lg" link="http://handbook.uws.edu.au/hbook/unit.aspx?unit=300580.2" text="course.learningGuide" />
              <ListItem key="tut" link="tutors" text="course.tutors" />
            </List>
          </Column>
          <Column>
            <Header5 inverted={true} text="library.label" />
            <List inverted={true} link={true}>
              <ListItem key="sch" link="schedules" text="schedules.label" />
            </List>
          </Column>
          <Column>
            <Header5 inverted={true} text="community.label" />
            <List inverted={true} link={true}>
              <ListItem key="bp" link="leaderboards" text="community.bestPlayers" />
              <ListItem key="pp" link="privacyPolicy" text="community.privacyPolicy" />
            </List>
          </Column>
        </Grid>
      </Column>
      <Column width={6}>
        <Header5 inverted={true} text="contact" />
        <div>
          Dr. Tomas Trescak <br />
          t.trescak@uws.edu.au <br />
        </div>
        <p>(02) 9685 9082</p>
      </Column>
    </Grid>
  </Segment>
);

export default Footer;
