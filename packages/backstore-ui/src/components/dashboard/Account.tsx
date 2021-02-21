import React from 'react';
import {
  Text,
  Menu,
  MenuItem,
  Avatar,
  MenuDivider,
  MenuButton,
  MenuList,
  Flex,
} from '@la-mk/blocks-ui';
import { Portal } from '@chakra-ui/react';

import { LogOut, ChevronDown, Settings } from 'react-feather';
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
            <Flex align='center'>
              <Text color='text.light'>
                <ChevronDown size='1.2rem' />
              </Text>

              <Text color='text.light'>{t('auth.account')}</Text>
            </Flex>
          )}
        </Flex>
      </MenuButton>
      {/* TODO: The portal needs to be taken care of better */}
      <Portal>
        <MenuList>
          <Link to='/dashboard/account'>
            <MenuItem>
              <Settings size='1.2rem' />
              <Text ml={2}>{t('common.preferences')}</Text>
            </MenuItem>
          </Link>

          <MenuDivider />

          <MenuItem key='logout' onClick={handleLogout}>
            <LogOut size='1.2rem' />
            <Text ml={2}>{t('auth.logout')}</Text>
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};
