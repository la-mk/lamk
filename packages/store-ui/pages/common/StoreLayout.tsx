import React from 'react';
import {
  Menu,
  MenuItem,
  Flex,
  // Search,
  Layout,
  Content,
  Header,
  Footer,
  Badge,
  Button,
  Dropdown,
  Avatar,
  Divider,
  Icon,
  SizedImage,
} from '@lamk/blocks-ui';
import styled from 'styled-components';
import Link from 'next/link';
import { sdk } from '@lamk/la-sdk';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { getStore } from '../../src/state/modules/store/store.selector';
import { getCartWithProducts } from '../../src/state/modules/cart/cart.selector';
import { logout } from '../../src/state/modules/auth/auth.module';
import { getUser } from '../../src/state/modules/user/user.selector';
import { toggleAuthModal } from '../../src/state/modules/ui/ui.module';
import { useTranslation } from '../../src/common/i18n';

interface StoreLayoutProps {
  children?: React.ReactNode;
}

const StyledContent = styled(Content)`
  overflow: initial;
  background: white;
`;

// This makes sure the anchor is as high as its content
const LineHeightFreeAnchor = styled.a`
  line-height: 0;
  height: 56px;
  margin: 4px 0;
`;

// const SizedSearch = styled(Search)`
//   max-width: 400px;
//   min-width: 80px;
// `;

const BorderedHeader = styled(Header)`
  background: white;
  border-bottom: 1px solid #e8e8e8;
`;

export const StoreLayout = ({ children }: StoreLayoutProps) => {
  const router = useRouter();
  const store = useSelector(getStore);
  const user = useSelector(getUser);
  const cart = useSelector(getCartWithProducts);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Not a very clean solution, but it will do for now
  const matches = router.pathname.match(/\/([^/]*)(\/?)/);
  const selectedKeys = matches && matches.length > 1 ? [matches[1]] : [];

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleLogin = () => {
    dispatch(toggleAuthModal(true));
  };

  return (
    <>
      <Layout theme='dark'>
        <BorderedHeader px={[2, 3, 3, 4]}>
          <Flex justifyContent='space-between'>
            <Link href='/' passHref>
              <LineHeightFreeAnchor>
                <SizedImage
                  height='100%'
                  src={sdk.artifact.getUrlForArtifact(store.logo)}
                  alt='logo'
                />
              </LineHeightFreeAnchor>
            </Link>
            {/* <SizedSearch mx={4} my={3} /> */}
            <Menu mode='horizontal' selectedKeys={selectedKeys}>
              <MenuItem p={0} key='products'>
                <Link href='/products' passHref>
                  <Button type='link'>{t('pages.product_plural')}</Button>
                </Link>
              </MenuItem>
              <MenuItem p={0} key='about'>
                <Link href='/about' passHref>
                  <Button type='link'>{t('pages.aboutUs')}</Button>
                </Link>
              </MenuItem>
              <MenuItem p={0} key='cart'>
                <Link href='/cart' passHref>
                  <Button mr={2} type='link'>
                    <Badge
                      showZero
                      offset={[8, 0]}
                      count={cart && cart.items ? cart.items.length : 0}
                    >
                      <Icon style={{ fontSize: 24 }} type='shopping-cart' />
                    </Badge>
                  </Button>
                </Link>
              </MenuItem>
              <MenuItem p={0} key='preferences'>
                <Dropdown
                  placement='bottomLeft'
                  overlay={
                    user ? (
                      <Menu>
                        <MenuItem key='account'>
                          <Link href='/account' passHref>
                            <Button type='link' icon='user'>
                              {t('pages.myAccount')}
                            </Button>
                          </Link>
                        </MenuItem>
                        <MenuItem key='orders'>
                          <Link href='/orders' passHref>
                            <Button type='link' icon='shopping'>
                              {t('pages.myOrders')}
                            </Button>
                          </Link>
                        </MenuItem>
                        <Divider mt={2} mb={0} />
                        <MenuItem key='logout'>
                          <Button
                            type='link'
                            icon='logout'
                            href=''
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
                            icon='login'
                            href=''
                            onClick={handleLogin}
                          >
                            {t('auth.login')}
                          </Button>
                        </MenuItem>
                      </Menu>
                    )
                  }
                >
                  <span>
                    <Avatar mx={2} icon='user' />
                    <Icon type='down' />
                  </span>
                </Dropdown>
              </MenuItem>
            </Menu>
          </Flex>
        </BorderedHeader>
        <StyledContent minHeight='calc(100vh - 64px - 65px)'>
          <Flex flexDirection='column' py={2}>
            {children}
          </Flex>
        </StyledContent>
        <Footer style={{ textAlign: 'center' }}>
          La.mk ©2019 Created by La.mk
        </Footer>
      </Layout>
    </>
  );
};
