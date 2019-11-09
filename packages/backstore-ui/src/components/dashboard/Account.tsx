import React from 'react';
import { Flex, Dropdown, Menu, MenuItem, Icon, MenuDivider } from '@lamk/blocks-ui';
import { useDispatch } from 'react-redux';
import { logout } from '../../state/modules/auth/auth.module';
import { useTranslation } from 'react-i18next';

export const Account = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
  };

  const menu = (
    <Menu>
      <MenuItem>
        <Icon type='user' /> {t('auth.accountSettings')}
      </MenuItem>
      <MenuDivider />
      <MenuItem onClick={handleLogout}>
        <Icon type='logout' /> {t('auth.logout')}
      </MenuItem>
    </Menu>
  );
  return (
    <Flex>
      <Dropdown placement='bottomRight' overlay={menu}>
        <span>
          {t('auth.account')} <Icon type='down' />
        </span>
      </Dropdown>
    </Flex>
  );
};
