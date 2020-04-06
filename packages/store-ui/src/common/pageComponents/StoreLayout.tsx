import React, { useEffect } from 'react';
import {
  Menu,
  MenuItem,
  Flex,
  Layout,
  Content,
  Header,
  Footer,
  Badge,
  Button,
  Dropdown,
  Avatar,
  Divider,
  Image,
  Text,
  Search,
  Box,
} from '@sradevski/blocks-ui';
import {
  ShoppingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  DownOutlined,
} from '@ant-design/icons';
import queryString from 'qs';
import styled from 'styled-components';
import Link from 'next/link';
import { sdk } from '@sradevski/la-sdk';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import { getCartWithProducts } from '../../state/modules/cart/cart.selector';
import { logout } from '../../state/modules/auth/auth.module';
import { getUser } from '../../state/modules/user/user.selector';
import { toggleAuthModal, setUiLoaded } from '../../state/modules/ui/ui.module';
import { useTranslation } from '../i18n';
import { FooterContent } from './FooterContent';
import { getFiltersFromSearch } from '../filterUtils';

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
  min-width: 56px;
  margin: 4px 0;
`;

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

  // Fire an event to know that the UI has loaded on the client-side.
  useEffect(() => {
    dispatch(setUiLoaded());
  }, []);

  // Not a very clean solution, but it will do for now
  const matches = router.pathname.match(/\/([^/]*)(\/?)/);
  const selectedKeys = matches && matches.length > 1 ? [matches[1]] : [];

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleLogin = () => {
    dispatch(toggleAuthModal(true));
  };

  const presetSearch = (
    <Search
      size='large'
      allowClear
      onSearch={val => {
        // Preserve the existing query parameters
        const productsUrl = `/products?${queryString.stringify({
          ...router.query,
          ...getFiltersFromSearch(val),
        })}`;

        router.push(productsUrl);
      }}
      placeholder={t('actions.search')}
      enterButton
    />
  );

  return (
    <>
      <Layout theme='light' style={{ backgroundColor: 'white' }}>
        <BorderedHeader height={['128px', '64px', '64px']} px={[2, 3, 4]}>
          <Flex justifyContent='space-between'>
            <Link href='/' passHref>
              <LineHeightFreeAnchor style={{ display: 'flex' }}>
                <Image
                  maxHeight='100%'
                  src={sdk.artifact.getUrlForArtifact(store.logo, store?._id)}
                  alt='logo'
                />
              </LineHeightFreeAnchor>
            </Link>
            <Box
              display={['none', 'block', 'block']}
              flex={1}
              minWidth='300px'
              maxWidth='800px'
              pt={2}
              mx={[2, 3, 4]}
              height='56px'
              my={1}
            >
              {presetSearch}
            </Box>
            <Menu
              style={{ borderBottom: 'none', lineHeight: '46px' }}
              my={1}
              maxWidth='80%'
              mode='horizontal'
              selectedKeys={selectedKeys}
            >
              <MenuItem p={0} key='products'>
                <Link href='/products' passHref>
                  <Button type='link'>
                    <ShoppingOutlined style={{ margin: 0, fontSize: 24 }} />
                    <Text display={['none', 'none', 'initial']}>
                      {t('pages.product_plural')}
                    </Text>
                  </Button>
                </Link>
              </MenuItem>
              <MenuItem p={0} key='about'>
                <Link href='/about' passHref>
                  <Button type='link'>
                    <ShopOutlined style={{ margin: 0, fontSize: 24 }} />
                    <Text display={['none', 'none', 'initial']}>
                      {t('pages.aboutUs')}
                    </Text>
                  </Button>
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
                      <ShoppingCartOutlined
                        style={{ margin: 0, fontSize: 24 }}
                      />
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
                  <a
                    className='ant-dropdown-link'
                    onClick={e => e.preventDefault()}
                  >
                    <Avatar ml={2} mr={1} icon={<UserOutlined />} />
                    <DownOutlined style={{ margin: 0 }} />
                  </a>
                </Dropdown>
              </MenuItem>
            </Menu>
          </Flex>
          <Box
            display={['block', 'none', 'none']}
            pt={2}
            mx={[2, 3, 4]}
            height='56px'
            my={1}
          >
            {presetSearch}
          </Box>
        </BorderedHeader>
        <StyledContent minHeight='calc(100vh - 64px - 65px)'>
          <Flex flexDirection='column'>{children}</Flex>
        </StyledContent>
        <Footer mt={4} style={{ textAlign: 'center' }}>
          <FooterContent store={store} />
        </Footer>
      </Layout>
    </>
  );
};
