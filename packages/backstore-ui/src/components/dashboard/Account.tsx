import React from 'react';
import {
  Box,
  Text,
  Menu,
  MenuItem,
  Avatar,
  MenuDivider,
  MenuButton,
  MenuList,
  Flex,
} from '@sradevski/blocks-ui';
import { Portal } from '@chakra-ui/react';

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

  return (
    <Menu>
      <MenuButton>
        <Flex width='100%' align='center' justify='center' direction='column'>
          <Avatar size='sm' />
          {!isSidebarCollapsed && (
            <Text color='text.light'>
              {t('auth.account')} <DownOutlined />
            </Text>
          )}
        </Flex>
      </MenuButton>
      {/* TODO: The portal needs to be taken care of better */}
      <Portal>
        <MenuList>
          <Link to='/dashboard/account'>
            <MenuItem>
              <SettingOutlined />
              <Text ml={2}>{t('common.preferences')}</Text>
            </MenuItem>
          </Link>

          <MenuDivider />

          <MenuItem key='logout' onClick={handleLogout}>
            <Box>
              <LogoutOutlined />
              <Text ml={2}>{t('auth.logout')}</Text>
            </Box>
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};
