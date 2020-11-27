import React from 'react';
import {
  Flex,
  Box,
  Text,
  Dropdown,
  Menu,
  MenuItem,
  Avatar,
  MenuDivider,
} from '@sradevski/blocks-ui';
import {
  LogoutOutlined,
  DownOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { logout } from '../../state/modules/auth/auth.module';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Account = ({
  isSidebarCollapsed,
}: {
  isSidebarCollapsed: boolean;
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
  };

  const menu = (
    <Menu>
      <MenuItem key='account'>
        <Link to='/dashboard/account'>
          <SettingOutlined />
          <Text ml={2}>{t('common.preferences')}</Text>
        </Link>
      </MenuItem>
      <MenuDivider />
      <MenuItem key='logout' onClick={handleLogout}>
        <Box>
          <LogoutOutlined />
          <Text ml={2}>{t('auth.logout')}</Text>
        </Box>
      </MenuItem>
    </Menu>
  );
  return (
    <Dropdown placement='bottomRight' overlay={menu}>
      <Flex mt={4} direction='column' align='center' justify='center'>
        <Avatar size='sm' />
        {!isSidebarCollapsed && (
          <span>
            {t('auth.account')} <DownOutlined />
          </span>
        )}
      </Flex>
    </Dropdown>
  );
};
