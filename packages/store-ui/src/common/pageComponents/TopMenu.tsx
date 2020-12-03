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
  ({ selectedKey, cartCount, user, handleLogout, handleLogin, theme }) => {
    const { t } = useTranslation();

    return (
      <>
        <Flex align='center' justify='center'>
          <HoverableLink href='/products'>
            <Flex align='center' justify='center' mx={3}>
              <Text
                style={{ lineHeight: 0 }}
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
            <Flex align='center' justify='center' mx={3}>
              <Text
                style={{ lineHeight: 0 }}
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
            <Flex align='center' justify='center' mx={3}>
              <Badge
                style={{ backgroundColor: theme.colors.primary }}
                showZero
                offset={[2, 2]}
                count={cartCount ?? 0}
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
                      <Button
                        as='a'
                        size='sm'
                        variant='ghost'
                        leftIcon={<UserOutlined />}
                      >
                        {t('pages.myAccount')}
                      </Button>
                    </Link>
                  </MenuItem>
                  <MenuItem key='orders'>
                    <Link href='/orders' passHref>
                      <Button
                        as='a'
                        size='sm'
                        variant='ghost'
                        leftIcon={<ShoppingOutlined />}
                      >
                        {t('pages.myOrders')}
                      </Button>
                    </Link>
                  </MenuItem>
                  <Divider mt={2} mb={0} />
                  <MenuItem key='logout'>
                    <Button
                      size='sm'
                      variant='ghost'
                      leftIcon={<LogoutOutlined />}
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
                      size='sm'
                      variant='ghost'
                      leftIcon={<LoginOutlined />}
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
              <Button size='sm' mx={3}>
                <UserOutlined />
              </Button>
            </Flex>
          </Dropdown>
        </Flex>
      </>
    );
  },
);
