import React from 'react';

import { CourseMenu, AdminMenu, CommunityMenu, LibraryMenu } from './menus_view';
import { UserView } from 'meteor/tomi:accountsui-semanticui-redux';
import { Menu, MenuItem } from 'semanticui-react';

interface IHeader {
  isAdmin: boolean;
  isLoggedIn: boolean;
}

export const Header = ({ isAdmin, isLoggedIn }: IHeader) => (
  <Menu inverted color="blue">
    <MenuItem classes="header" link="/" icon="bug" text="site.name" />
    <Menu position="right">
      <If condition={isAdmin}>
        <MenuItem link="book" icon="book" text="route.book" />
        <AdminMenu />
      </If>
      <CourseMenu />
      <CommunityMenu />
      <LibraryMenu />
      <If condition={isLoggedIn}>
        <UserView />
      </If>
    </Menu>
  </Menu>
);

export default Header;
