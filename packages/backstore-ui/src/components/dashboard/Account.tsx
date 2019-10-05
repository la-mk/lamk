import React from 'react';
import { Flex, Dropdown, Menu, MenuItem, Icon, MenuDivider } from '@lamk/blocks-ui';
import { useDispatch } from 'react-redux';
import { logout } from '../../state/modules/auth/auth.module';

export const Account = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
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
          Account <Icon type='down' />
        </span>
      </Dropdown>
    </Flex>
  );
};
