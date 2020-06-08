import React from 'react';
import {
  Flex,
  Menu,
  MenuItem,
  Badge,
  Button,
  Dropdown,
  Divider,
  Text,
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
  ({ selectedKey, cart, user, handleLogout, handleLogin, theme }) => {
    const { t } = useTranslation();

    return (
      <>
        <Flex alignItems='center' justifyContent='center'>
          <HoverableLink href='/products'>
            <Flex alignItems='center' justifyContent='center' mx={3}>
              <Text
                color={selectedKey === 'products' ? 'primary' : 'text.dark'}
                fontSize={4}
              >
                <ShoppingOutlined />
              </Text>
              <Text
                color={selectedKey === 'products' ? 'primary' : 'text.dark'}
                ml={2}
                fontSize={0}
                display={['none', 'none', 'initial']}
              >
                {t('pages.product_plural')}
              </Text>
            </Flex>
          </HoverableLink>

          <HoverableLink href='/about'>
            <Flex alignItems='center' justifyContent='center' mx={3}>
              <Text
                color={selectedKey === 'about' ? 'primary' : 'text.dark'}
                fontSize={4}
              >
                <ShopOutlined />
              </Text>
              <Text
                color={selectedKey === 'about' ? 'primary' : 'text.dark'}
                ml={2}
                fontSize={0}
                display={['none', 'none', 'initial']}
              >
                {t('pages.aboutUs')}
              </Text>
            </Flex>
          </HoverableLink>

          <HoverableLink href='/cart'>
            <Flex alignItems='center' justifyContent='center' mx={3}>
              <Badge
                style={{ backgroundColor: theme.colors.primary }}
                showZero
                offset={[2, 2]}
                count={cart && cart.items ? cart.items.length : 0}
              >
                <Text
                  color={selectedKey === 'cart' ? 'primary' : 'text.dark'}
                  fontSize={4}
                >
                  <ShoppingCartOutlined />
                </Text>
              </Badge>
            </Flex>
          </HoverableLink>

          <Dropdown
            trigger={['click']}
            placement='bottomLeft'
            overlay={
              user ? (
                <Menu>
                  <MenuItem key='account'>
                    <Link href='/account' passHref>
                      <Button type='link' icon={<UserOutlined />}>
                        {t('pages.myAccount')}
                      </Button>
                    </Link>
                  </MenuItem>
                  <MenuItem key='orders'>
                    <Link href='/orders' passHref>
                      <Button type='link' icon={<ShoppingOutlined />}>
                        {t('pages.myOrders')}
                      </Button>
                    </Link>
                  </MenuItem>
                  <Divider mt={2} mb={0} />
                  <MenuItem key='logout'>
                    <Button
                      type='link'
                      icon={<LogoutOutlined />}
                      onClick={handleLogout}
                    >
                      {t('auth.logout')}
                    </Button>
                  </MenuItem>
                </Menu>
              ) : (
                <Menu>
                  <MenuItem key='login'>
                    <Button
                      type='link'
                      icon={<LoginOutlined />}
                      onClick={handleLogin}
                    >
                      {t('auth.login')}
                    </Button>
                  </MenuItem>
                </Menu>
              )
            }
          >
            <Flex>
              <Button
                mx={3}
                type='primary'
                icon={<UserOutlined style={{ margin: 0 }} />}
              />
            </Flex>
          </Dropdown>
        </Flex>
      </>
    );
  },
);
