import React from 'react';
import {
  Flex,
  Menu,
  MenuItem,
  Badge,
  Button,
  Dropdown,
  Divider,
  Label,
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
        <Flex alignItems='center' justifyContent='center'>
          <HoverableLink href='/products'>
            <Flex alignItems='center' justifyContent='center' mx={3}>
              <Label
                $style={{ fontSize: '26px' }}
                color={
                  selectedKey === 'products' ? 'primary' : 'contentTertiary'
                }
              >
                <ShoppingOutlined />
              </Label>
              <Label
                size='xsmall'
                color={
                  selectedKey === 'products' ? 'primary' : 'contentTertiary'
                }
                ml={2}
                display={['none', 'none', 'initial']}
              >
                {t('pages.product_plural')}
              </Label>
            </Flex>
          </HoverableLink>

          <HoverableLink href='/about'>
            <Flex alignItems='center' justifyContent='center' mx={3}>
              <Label
                $style={{ fontSize: '26px' }}
                color={selectedKey === 'about' ? 'primary' : 'contentTertiary'}
              >
                <ShopOutlined />
              </Label>
              <Label
                size='xsmall'
                color={selectedKey === 'about' ? 'primary' : 'contentTertiary'}
                ml={2}
                display={['none', 'none', 'initial']}
              >
                {t('pages.aboutUs')}
              </Label>
            </Flex>
          </HoverableLink>

          <HoverableLink href='/cart'>
            <Flex alignItems='center' justifyContent='center' mx={3}>
              <Badge
                style={{ backgroundColor: theme.colors.primary }}
                showZero
                offset={[2, 2]}
                count={cartCount ?? 0}
              >
                <Label
                  $style={{ fontSize: '26px' }}
                  color={selectedKey === 'cart' ? 'primary' : 'contentTertiary'}
                >
                  <ShoppingCartOutlined />
                </Label>
              </Badge>
            </Flex>
          </HoverableLink>

          <Dropdown
            trigger={['click']}
            placement='bottomLeft'
            overlay={
              user ? (
                <Menu>
                  <MenuItem
                    key='account'
                    style={{ backgroundColor: 'white', padding: '0 8px' }}
                  >
                    <Button
                      size='compact'
                      kind='tertiary'
                      startEnhancer={() => <UserOutlined />}
                    >
                      <Link href='/account'>{t('pages.myAccount')}</Link>
                    </Button>
                  </MenuItem>
                  <MenuItem
                    key='orders'
                    style={{ backgroundColor: 'white', padding: '0 8px' }}
                  >
                    <Button
                      size='compact'
                      kind='tertiary'
                      startEnhancer={() => <ShoppingOutlined />}
                    >
                      <Link href='/orders'>{t('pages.myOrders')}</Link>
                    </Button>
                  </MenuItem>
                  <Divider mt={2} mb={0} />
                  <MenuItem
                    key='logout'
                    style={{ backgroundColor: 'white', padding: '0 8px' }}
                  >
                    <Button
                      size='compact'
                      kind='tertiary'
                      startEnhancer={() => <LogoutOutlined />}
                      onClick={handleLogout}
                    >
                      {t('auth.logout')}
                    </Button>
                  </MenuItem>
                </Menu>
              ) : (
                <Menu>
                  <MenuItem
                    key='login'
                    style={{ backgroundColor: 'white', padding: '0 8px' }}
                  >
                    <Button
                      size='compact'
                      kind='tertiary'
                      startEnhancer={() => <LoginOutlined />}
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
              <Button mx={3}>
                <UserOutlined style={{ margin: 0 }} />
              </Button>
            </Flex>
          </Dropdown>
        </Flex>
      </>
    );
  },
);
