import React from 'react';
import {
  Flex,
  Dropdown,
  Menu,
  MenuItem,
  message,
  Icon,
  MenuDivider,
} from 'blocks-ui';
import { sdk } from 'la-sdk';
import { useDispatch } from 'react-redux';
import { replaceTo } from '../../state/modules/navigation/navigation.actions';

export const Account = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    sdk.authentication
      .logout()
      .then(() => dispatch(replaceTo('/login')))
      .catch(err => message.error(err.message));
  };

  const menu = (
    <Menu>
      <MenuItem>
        <Icon type='user' /> Account Settings
      </MenuItem>
      <MenuDivider />
      <MenuItem onClick={handleLogout}>
        <Icon type='logout' /> Logout
      </MenuItem>
    </Menu>
  );
  return (
    <Flex>
      <Dropdown placement='bottomRight' overlay={menu}>
        <span>
          Stevche <Icon type='down' />
        </span>
      </Dropdown>
    </Flex>
  );
};
