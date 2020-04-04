import React from 'react';
import {
  Flex,
  Dropdown,
  Menu,
  MenuItem,
  MenuDivider,
} from '@sradevski/blocks-ui';
import { UserOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { logout } from '../../state/modules/auth/auth.module';
import { useTranslation } from 'react-i18next';

export const Account = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
  };

  const menu = (
    <Menu>
      <MenuItem>
        <UserOutlined /> {t('auth.accountSettings')}
      </MenuItem>
      <MenuDivider />
      <MenuItem onClick={handleLogout}>
        <LogoutOutlined /> {t('auth.logout')}
      </MenuItem>
    </Menu>
  );
  return (
    <Flex>
      <Dropdown placement='bottomRight' overlay={menu}>
        <span>
          {t('auth.account')} <DownOutlined />
        </span>
      </Dropdown>
    </Flex>
  );
};
