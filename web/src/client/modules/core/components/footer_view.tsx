import * as React from 'react';
import {CourseMenuItems, LibraryMenuItems, CommunityMenuItems} from './menus_view';
import { Segment, Grid, Column, Header5, List } from 'semanticui-react';

const Footer = () => (
  <Segment inverted={true}  classes="footer vertical">
    <Grid classes="stackable center aligned page">
      <Column width={10}>
        <Grid columns={3} classes="center aligned stackable">
          <Column>
            <Header5 inverted={true} text="course.label" />
            <List inverted={true} link={true}>{CourseMenuItems() }</List>
          </Column>
          <Column>
            <Header5 inverted={true} text="library.label" />
            <List inverted={true} link={true}>{LibraryMenuItems(false) }</List>
          </Column>
          <Column>
            <Header5 inverted={true} text="community.label" />
            <List inverted={true} link={true}>{CommunityMenuItems() }</List>
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
