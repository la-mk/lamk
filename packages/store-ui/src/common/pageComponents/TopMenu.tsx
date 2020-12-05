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
  Positioner,
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
