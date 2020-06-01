import React from 'react';
import { Flex, Dropdown, Menu, MenuItem, Avatar } from '@sradevski/blocks-ui';
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
      {/* <MenuItem>
        <SettingOutlined /> {t('auth.accountSettings')}
      </MenuItem>
      <MenuDivider /> */}
      <MenuItem onClick={handleLogout}>
        <LogoutOutlined /> {t('auth.logout')}
      </MenuItem>
    </Menu>
  );
  return (
    <Dropdown placement='bottomRight' overlay={menu}>
      <Flex flexDirection='column' alignItems='center' justifyContent='center'>
        <Avatar icon={<UserOutlined />} />
        <span>
          {t('auth.account')} <DownOutlined />
        </span>
      </Flex>
    </Dropdown>
  );
};
