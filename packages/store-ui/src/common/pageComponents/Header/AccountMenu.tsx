import React from 'react';
import {
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  MenuDivider,
} from '@la-mk/blocks-ui';
import { ShoppingBag, User as UserIcon, LogOut, LogIn } from 'react-feather';
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

  /* There is a bug in Chakra where the menu is expanded horizontally on initial render, so we hide it on SSR. https://github.com/chakra-ui/chakra-ui/issues/3433 */
  if (typeof window === 'undefined') {
    return (
      <NavButton
        variant={ownTheme.account.variant}
        title={t('auth.account')}
        hideTitle
        icon={<UserIcon size='1.2rem' />}
        size='sm'
      />
    );
  }

  return (
    <Menu>
      <MenuButton
        as={React.forwardRef((props, ref) => (
          <NavButton
            ref={ref}
            {...props}
            children={undefined}
            variant={ownTheme.account.variant}
            title={t('auth.account')}
            hideTitle
            icon={<UserIcon size='1.2rem' />}
            size='sm'
          />
        ))}
      />
      <MenuList>
        {user ? (
          <>
            <Link href='/account' passHref>
              <MenuItem as='a' icon={<UserIcon size='1.2rem' />}>
                {t('pages.myAccount')}
              </MenuItem>
            </Link>

            <Link href='/account/orders' passHref>
              <MenuItem as='a' icon={<ShoppingBag size='1.2rem' />}>
                {t('pages.myOrders')}
              </MenuItem>
            </Link>
            <MenuDivider />
            <MenuItem onClick={handleLogout} icon={<LogOut size='1.2rem' />}>
              {t('auth.logout')}
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={handleLogin} icon={<LogIn size='1.2rem' />}>
              {t('auth.login')}
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};
