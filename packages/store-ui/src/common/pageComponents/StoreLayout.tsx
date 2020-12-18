import React, { useEffect } from 'react';
import { Flex, Layout, Input, Box, Image } from '@sradevski/blocks-ui';
import queryString from 'qs';
import styled, { withTheme } from 'styled-components';
import Link from 'next/link';
import { sdk } from '@sradevski/la-sdk';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import { getCartCount } from '../../state/modules/cart/cart.selector';
import { logout } from '../../state/modules/auth/auth.module';
import { getUser } from '../../state/modules/user/user.selector';
import { toggleAuthModal, setUiLoaded } from '../../state/modules/ui/ui.module';
import { useTranslation } from '../i18n';
import { FooterContent } from './Footer/FooterContent';
import { getFiltersFromSearch } from '../filterUtils';
import { TopMenu } from './TopMenu';
import { SubMenu } from './SubMenu';
import { BlocksTheme } from '@sradevski/blocks-ui/dist/theme';
import { Breadcrumbs } from './Breadcrumbs';

interface StoreLayoutProps {
  children?: React.ReactNode;
  theme: BlocksTheme;
}

// This makes sure the anchor is as high as its content
const LineHeightFreeAnchor = styled.a`
  line-height: 0;
  height: 56px;
  min-width: 56px;
  margin: 4px 0;
`;

export const StoreLayout = withTheme(
  ({ theme, children }: StoreLayoutProps) => {
    const router = useRouter();
    const store = useSelector(getStore);
    const user = useSelector(getUser);
    const cartCount = useSelector(getCartCount);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    // Fire an event to know that the UI has loaded on the client-side.
    useEffect(() => {
      dispatch(setUiLoaded());
    }, []);

    //  TODO: We currently don't highlight the selected page, support it in the future
    // const matches = router.pathname.match(/\/([^/]*)(\/?)/);
    // const selectedKey = matches && matches.length > 1 ? matches[1] : undefined;

    const handleLogout = () => {
      dispatch(logout());
    };

    const handleLogin = () => {
      dispatch(toggleAuthModal(true));
    };

    const presetSearch = (
      <Flex height={'56px'} width='100%' align='center' justify='center'>
        <Input
          type='search'
          size='lg'
          onSearch={val => {
            // We don't want to preserve the existing parameters for now, see if this would be an issue.
            const productsUrl = `/products?${queryString.stringify({
              // ...router.query,
              ...getFiltersFromSearch(val),
            })}`;

            router.push(productsUrl);
          }}
          placeholder={t('actions.search')}
        />
      </Flex>
    );

    return (
      <>
        <Layout
          header={
            <Box
              as='nav'
              height={['128px', '64px', '64px']}
              px={[2, 6, 7]}
              // @ts-ignore
              border='1px solid #e8e8e8'
            >
              <Flex justify='space-between'>
                <Link href='/' passHref>
                  <LineHeightFreeAnchor style={{ display: 'flex' }}>
                    <Box height={'56px'}>
                      <Image
                        getSrc={params =>
                          sdk.artifact.getUrlForImage(
                            store?.logo,
                            store?._id,
                            params,
                          )
                        }
                        height={64}
                        alt='logo'
                      />
                    </Box>
                  </LineHeightFreeAnchor>
                </Link>
                <Box
                  display={['none', 'block', 'block']}
                  flex={1}
                  minWidth='18rem'
                  maxWidth='54rem'
                  mx={[2, 3, 4]}
                  my={1}
                >
                  {presetSearch}
                </Box>
                <TopMenu
                  user={user}
                  cartCount={cartCount}
                  handleLogin={handleLogin}
                  handleLogout={handleLogout}
                />
              </Flex>
              <Box display={['block', 'none', 'none']} mx={[2, 3, 4]} my={1}>
                {presetSearch}
              </Box>
            </Box>
          }
          footer={
            <Box mt={7} bg='background.dark'>
              <FooterContent store={store} />
            </Box>
          }
        >
          <Box minHeight='calc(100vh - 200px)'>
            <SubMenu />
            <div id='categories-portal-root' />
            <Breadcrumbs minHeight={'56px'} />
            <Flex direction='column'>{children}</Flex>
          </Box>
        </Layout>
      </>
    );
  },
);
