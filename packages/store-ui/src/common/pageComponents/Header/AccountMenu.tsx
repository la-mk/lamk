import React from 'react';
import {
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  MenuDivider,
} from '@la-mk/blocks-ui';
import {
  ShoppingOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { useTheme } from '@chakra-ui/react';
import Link from 'next/link';
import { NavButton } from './NavButton';
import { User } from '@la-mk/la-sdk/dist/models/user';
import { useTranslation } from '../../i18n';

export interface AccountMenuProps {
  user?: User;
  handleLogout: () => void;
  handleLogin: () => void;
}

export const AccountMenu = ({
  user,
  handleLogout,
  handleLogin,
}: AccountMenuProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const ownTheme = theme.sections.Header;

  return (
    <Menu>
      <MenuButton
        // TODO: The MenuButton sends a child to the button even if you didn't provide any, PR in Chakra.
        // @ts-ignore
        as={React.useMemo(
          () =>
            React.forwardRef((props, ref) => (
              <NavButton
                ref={ref}
                {...props}
                variant={ownTheme.account.variant}
                title={t('auth.account')}
                hideTitle
                icon={<UserOutlined />}
                size='sm'
              />
            )),
          [],
        )}
      />
      <MenuList>
        {user ? (
          <>
            <Link href='/account' passHref>
              <MenuItem as='a' icon={<UserOutlined />}>
                {t('pages.myAccount')}
              </MenuItem>
            </Link>

            <Link href='/account/orders' passHref>
              <MenuItem as='a' icon={<ShoppingOutlined />}>
                {t('pages.myOrders')}
              </MenuItem>
            </Link>
            <MenuDivider />
            <MenuItem onClick={handleLogout} icon={<LogoutOutlined />}>
              {t('auth.logout')}
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={handleLogin} icon={<LoginOutlined />}>
              {t('auth.login')}
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};
