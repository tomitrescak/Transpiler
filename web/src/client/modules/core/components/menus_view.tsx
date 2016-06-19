import React from 'react';
import { Menu, MenuItem, MenuDropdown, Divider } from 'semanticui-react';

//////////////////////////////////////////////////////
// AdminMenu Component                              //
//////////////////////////////////////////////////////


export const AdminMenu = () => (
  <MenuDropdown icon="doctor" text="adminMenu" id="adminMenuDropdown">
    <Menu>
      <MenuItem link="schedules" text="schedules.label" />
      <MenuItem link="practicals" text="practicals.label" />
      <MenuItem link="exercises" text="exercises" />
      <Divider />
      <MenuItem link="groupMail" text="groupMail.label" icon="mail" />
      <Divider />
      <MenuItem link="siteSettings" icon="sitemap" text="siteSettings.label" />
      <MenuItem link="worlds" icon="world" text="worlds.label" />
      <MenuItem link="configuration" icon="settings" text="configuration.label" />
      <Divider />
      <MenuItem link="activity" icon="exchange" text="activity" />
    </Menu>
  </MenuDropdown>
);

//////////////////////////////////////////////////////
// CommunityMenu Component                          //
//////////////////////////////////////////////////////

export const CommunityMenu = () => (
  <MenuDropdown id="communityMenuDropdown" text="community.label">
    <MenuItem key="dp" link="leaderboards" text="community.bestPlayers" />
    <MenuItem key="bp" link="leaderboards" text="community.bestPlayers" />
    <MenuItem key="pp" link="privacyPolicy" text="community.privacyPolicy" />
  </MenuDropdown>
);

//////////////////////////////////////////////////////
// CourseMenu Component                             //
//////////////////////////////////////////////////////

export const CourseMenu = () => (
  <MenuDropdown text="course.label" id="courseMenuDropdown">
    <MenuItem key="cl" link="calendar" text="calendar.label" />
    <MenuItem key="lg" link="http://handbook.uws.edu.au/hbook/unit.aspx?unit=300580.2" text="course.learningGuide" />
    <MenuItem key="tut" link="tutors" text="course.tutors" />
  </MenuDropdown>
);

//////////////////////////////////////////////////////////////////////////////
// LibraryMenu Component                                                      //
//////////////////////////////////////////////////////////////////////////////

export const LibraryMenu = () => (
  <MenuDropdown text="library.label" id="libraryDropdown">
    <MenuItem key="sch" link="schedules" text="schedules.label" />
  </MenuDropdown>
);
