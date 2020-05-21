import React, { useEffect } from 'react';
import {
  Flex,
  Layout,
  Content,
  Header,
  Footer,
  Image,
  Search,
  Box,
} from '@sradevski/blocks-ui';
import queryString from 'qs';
import styled, { withTheme } from 'styled-components';
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

export const StoreLayout = withTheme(
  ({ theme, children }: StoreLayoutProps) => {
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
    const selectedKey = matches && matches.length > 1 ? matches[1] : undefined;

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
                    src={sdk.artifact.getUrlForArtifact(
                      store?.logo,
                      store?._id,
                    )}
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
              <TopMenu
                selectedKey={selectedKey}
                user={user}
                cart={cart}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
              />
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
            <SubMenu height={64} />
            <Breadcrumbs minHeight={56} />
            <Flex flexDirection='column'>{children}</Flex>
          </StyledContent>
          <Footer
            mt={4}
            style={{
              textAlign: 'center',
              background: theme.colors.background.dark,
            }}
          >
            <FooterContent store={store} />
          </Footer>
        </Layout>
      </>
    );
  },
);
