import React from 'react';
import { Menu, MenuItem, MenuDropdown, Divider } from 'semanticui-react';

//////////////////////////////////////////////////////
// AdminMenu Component                              //
//////////////////////////////////////////////////////

export class AdminMenuItems extends React.Component<{}, {}> {
  render() {
    return (
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
    );
  }
}

export const AdminMenu = () => (
  <MenuDropdown icon="doctor" text="adminMenu" id="adminMenuDropdown">
    <AdminMenuItems />
  </MenuDropdown>
);

//////////////////////////////////////////////////////
// CommunityMenu Component                          //
//////////////////////////////////////////////////////

let cmItems: any[] = null;

export function CommunityMenuItems(): any[] {
  if (cmItems == null) {
    cmItems = [
      <MenuItem key="bp" link="leaderboards" text="community.bestPlayers" />,
      <MenuItem key="pp" link="privacyPolicy" text="community.privacyPolicy" />
    ];
  }
  return cmItems;
}


export const CommunityMenu = () => (
  <MenuDropdown id="communityMenuDropdown" text="community.label">
    {CommunityMenuItems() }
  </MenuDropdown>
);

//////////////////////////////////////////////////////
// CourseMenu Component                             //
//////////////////////////////////////////////////////

let crmItems: any[] = null;
export function CourseMenuItems(): any[] {
  if (crmItems == null) {
    crmItems = [
      <MenuItem key="cl" link="calendar" text="calendar.label" />,
      <MenuItem key="lg" link="http://handbook.uws.edu.au/hbook/unit.aspx?unit=300580.2" text="course.learningGuide" />,
      <MenuItem key="tut" link="tutors" text="course.tutors" />
    ];
  }
  return crmItems;
}

export const CourseMenu = () => (
  <MenuDropdown text="course.label" id="courseMenuDropdown">
    {CourseMenuItems() }
  </MenuDropdown>
);

//////////////////////////////////////////////////////////////////////////////
// LibraryMenu Component                                                      //
//////////////////////////////////////////////////////////////////////////////

// export var libraryMenuItems: any[] = [];
// libraryMenuItems.push(<MenuItem link={ RouterUtils.pathFor('schedules') }>{ mf ('schedules.label') }</MenuItem>);


let lmItems: any[] = null;

export function LibraryMenuItems({ viewExercises }: any): any[] {
  if (lmItems == null) {
    lmItems = [
      <MenuItem key="sch" link="schedules" text="schedules.label" />
    ];

    if (viewExercises) {
      lmItems.push(<MenuItem key="exerc" link="exercises" text="library.recentExercises" />);
    }
  }
  return lmItems;
}

export const LibraryMenu = () => (
  <MenuDropdown text="library.label" id="libraryDropdown">
    { LibraryMenuItems(false) }
  </MenuDropdown>
);
