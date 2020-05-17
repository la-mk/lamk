import React from 'react';
import {
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

const ICON_SIZE = 24;

export const TopMenu = withTheme(
  ({ selectedKeys, cart, user, handleLogout, handleLogin, theme }) => {
    const { t } = useTranslation();

    return (
      <>
        <Menu
          style={{ borderBottom: 'none', lineHeight: '46px' }}
          my={1}
          maxWidth='80%'
          mode='horizontal'
          selectedKeys={selectedKeys}
        >
          <MenuItem p={0} mx={[1, 1, 2]} key='products'>
            <Link href='/products' passHref>
              <Button type='link'>
                <ShoppingOutlined style={{ margin: 0, fontSize: ICON_SIZE }} />
                <Text
                  fontSize={1}
                  color='mutedText.dark'
                  display={['none', 'none', 'initial']}
                >
                  {t('pages.product_plural')}
                </Text>
              </Button>
            </Link>
          </MenuItem>

          <MenuItem p={0} mx={[1, 1, 2]} key='about'>
            <Link href='/about' passHref>
              <Button type='link'>
                <ShopOutlined style={{ margin: 0, fontSize: ICON_SIZE }} />
                <Text
                  fontSize={1}
                  color='mutedText.dark'
                  display={['none', 'none', 'initial']}
                >
                  {t('pages.aboutUs')}
                </Text>
              </Button>
            </Link>
          </MenuItem>

          <MenuItem p={0} mx={[1, 1, 2]} key='cart'>
            <Link href='/cart' passHref>
              <Button mr={2} type='link'>
                <Badge
                  style={{ backgroundColor: theme.colors.primary }}
                  showZero
                  offset={[2, 2]}
                  count={cart && cart.items ? cart.items.length : 0}
                >
                  <ShoppingCartOutlined
                    style={{ margin: 0, fontSize: ICON_SIZE }}
                  />
                </Badge>
              </Button>
            </Link>
          </MenuItem>
          <MenuItem p={0} mx={[1, 1, 2]} key='preferences'>
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
              <Button
                type='primary'
                icon={<UserOutlined style={{ margin: 0 }} />}
              />
            </Dropdown>
          </MenuItem>
        </Menu>
      </>
    );
  },
);
