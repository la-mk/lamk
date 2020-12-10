import React from 'react';
import {
  Flex,
  Menu,
  MenuItem,
  Badge,
  Button,
  Text,
  Positioner,
  MenuButton,
  MenuList,
  MenuDivider,
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
import { withTheme } from 'styled-components';
import { useTranslation } from '../i18n';
import { HoverableLink } from '../../components/shared/components/HoverableLink';

export const TopMenu = withTheme(
  ({ selectedKey, cartCount, user, handleLogout, handleLogin }) => {
    const { t } = useTranslation();

    return (
      <>
        <Flex align='center' justify='center'>
          <HoverableLink href='/products'>
            <Flex align='center' justify='center' mx={3}>
              <Text
                lineHeight='none'
                color={selectedKey === 'products' ? 'primary' : 'text.dark'}
                size='lg'
              >
                <ShoppingOutlined />
              </Text>
              <Text
                color={selectedKey === 'products' ? 'primary' : 'text.dark'}
                ml={2}
                size='sm'
                display={['none', 'none', 'initial']}
              >
                {t('pages.product_plural')}
              </Text>
            </Flex>
          </HoverableLink>

          <HoverableLink href='/about'>
            <Flex align='center' justify='center' mx={3}>
              <Text
                lineHeight='none'
                color={selectedKey === 'about' ? 'primary' : 'text.dark'}
                size='lg'
              >
                <ShopOutlined />
              </Text>
              <Text
                color={selectedKey === 'about' ? 'primary' : 'text.dark'}
                ml={2}
                size='sm'
                display={['none', 'none', 'initial']}
              >
                {t('pages.aboutUs')}
              </Text>
            </Flex>
          </HoverableLink>

          <HoverableLink href='/cart'>
            <Flex
              align='center'
              justify='center'
              mx={3}
              // @ts-ignore
              style={{ lineHeight: '1rem' }}
            >
              <Positioner
                overlayContent={
                  <Badge
                    colorScheme='primary'
                    variant='solid'
                    borderRadius='full'
                    size='xs'
                  >
                    {cartCount ?? 0}
                  </Badge>
                }
              >
                <Text
                  color={selectedKey === 'cart' ? 'primary' : 'text.dark'}
                  size='lg'
                >
                  <ShoppingCartOutlined />
                </Text>
              </Positioner>
            </Flex>
          </HoverableLink>

          <Menu>
            <MenuButton as={Button} size='sm' mx={3}>
              <UserOutlined />
            </MenuButton>
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
  },
);
