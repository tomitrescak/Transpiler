import React from 'react';
import { Menu, MenuItem } from 'semanticui-react';
import { UserView } from 'meteor/tomi:accountsui-semanticui-redux';
import jss from '../../../configs/jss';

const styles = {
  header: {
    margin: '12px!important',
    '& .item': {
      cursor: 'pointer'
    }
  }
};
const {classes} = jss.createStyleSheet(styles).attach();

export interface IComponentActions {
  create: () => void;
  save: () => void;
}

export interface IComponentProps {
  user: any;
}

export interface IProps extends IComponentActions, IComponentProps {}

const Header = ({ user, create, save }: IProps) => (
    <Menu inverted={true} color="blue" classes={classes.header}>
      <MenuItem link="/" icon="bug" text="Marking" />
      <MenuItem icon="file" text="Create" link="/" />
      <MenuItem icon="save" text="Save" onClick={save} />
      <Menu position="right">
        { user ? <UserView /> : null }
      </Menu>
    </Menu>
);

// component.contextTypes = {
//   router: React.PropTypes.func.isRequired
// };

export default Header;
