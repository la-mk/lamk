import React from 'react';
import {
  Flex,
  Menu,
  MenuItem,
  Badge,
  Button,
  Positioner,
  MenuButton,
  MenuList,
  MenuDivider,
  Text,
  hooks,
} from '@sradevski/blocks-ui';
import {
  ShoppingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useTranslation } from '../i18n';
import { User } from '@sradevski/la-sdk/dist/models/user';

const NavButton = ({ title, icon, href, hideTitle }: any) => {
  const showTitle = hooks.useBreakpoint([false, false, true]);
  const hasTitle = !hideTitle && showTitle;
  return (
    <Link passHref href={href}>
      <Button
        mx={hasTitle ? 3 : 1}
        as='a'
        variant='link'
        aria-label={title}
        leftIcon={<Text size='2xl'>{icon}</Text>}
      >
        {!hideTitle && showTitle && title}
      </Button>
    </Link>
  );
};

export interface TopMenuProps {
  cartCount?: number;
  user?: User;
  handleLogout: () => void;
  handleLogin: () => void;
}

export const TopMenu = ({
  cartCount,
  user,
  handleLogout,
  handleLogin,
}: TopMenuProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Flex align='center' justify='center'>
        <NavButton
          href='/products'
          title={t('pages.product_plural')}
          icon={<ShoppingOutlined />}
        />

        <NavButton
          href='/about'
          title={t('pages.aboutUs')}
          icon={<ShopOutlined />}
        />

        <NavButton
          href='/cart'
          title={t('pages.cart')}
          hideTitle
          icon={
            <Positioner
              overlayContent={
                <Badge
                  colorScheme='primary'
                  variant='solid'
                  borderRadius='full'
                  size='sm'
                  py={'1px'}
                >
                  {cartCount ?? 0}
                </Badge>
              }
            >
              <ShoppingCartOutlined />
            </Positioner>
          }
        />

        <Menu>
          <MenuButton
            // TODO: The MenuButton sends a child to the button even if you didn't provide any, PR in Chakra.
            as={React.useMemo(
              () =>
                React.forwardRef((props, ref) => (
                  <Button {...props} ref={ref} children={null} />
                )),
              [],
            )}
            aria-label={t('auth.account')}
            size='sm'
            mx={3}
            leftIcon={<UserOutlined />}
            children={null}
          />
          <MenuList>
            {user ? (
              <>
                <Link href='/account' passHref>
                  <MenuItem as='a' icon={<UserOutlined />}>
                    {t('pages.myAccount')}
                  </MenuItem>
                </Link>

                <Link href='/orders' passHref>
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
      </Flex>
    </>
  );
};
