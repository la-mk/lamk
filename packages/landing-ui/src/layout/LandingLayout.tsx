import React, { useState, useEffect } from 'react';
import {
  Layout,
  Box,
  Image,
  Flex,
  Button,
  Drawer,
  hooks,
} from '@sradevski/blocks-ui';
import { MenuOutlined } from '@ant-design/icons';
import styled, { withTheme } from 'styled-components';
import Link from 'next/link';
import { TopMenu } from './TopMenu';
import { trackInitialLoad, track } from '../common/analytics';
import { Router } from 'next/router';
import { session, AnalyticsEvents } from '@sradevski/analytics';
import { BlocksTheme } from '@sradevski/blocks-ui/dist/theme';
import { FooterContent } from './FooterContent';

interface StoreLayoutProps {
  children?: React.ReactNode;
  theme: BlocksTheme;
}

// This makes sure the anchor is as high as its content
const LineHeightFreeAnchor = styled.a`
  display: flex;
  line-height: 0;
  height: 56px;
  min-width: 56px;
  margin: 4px 0;
  padding: 4px;
`;

export const LandingLayout = withTheme(
  ({ theme, children }: StoreLayoutProps) => {
    const isMenuCollapsed = hooks.useBreakpoint([true, true, false]);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    // Fire an event to know that the UI has loaded on the client-side.
    useEffect(() => {
      trackInitialLoad();
      const onRouteChange = () => {
        const sessionInfo = session.getSessionInfo();
        if (!sessionInfo) {
          return;
        }

        // Reset the time on every navigation.
        sessionInfo.startTimestamp = Date.now();
        sessionInfo.previousPage = document.location.href;
        sessionInfo.pageVisits += 1;
        session.setSessionInfo(sessionInfo);
      };

      const onTrackPageView = () => {
        track(AnalyticsEvents.pageView);
      };

      Router.events.on('beforeHistoryChange', onRouteChange);
      Router.events.on('routeChangeComplete', onTrackPageView);
      return () => {
        Router.events.off('beforeHistoryChange', onRouteChange);
        Router.events.off('routeChangeComplete', onTrackPageView);
      };
    }, []);

    return (
      <>
        <Layout
          header={
            <Box
              as='nav'
              height={['128px', '64px', '64px']}
              px={[2, 6, 7]}
              bg='background.light'
              // @ts-ignore
              style={{
                zIndex: 3,
                boxShadow: '0px -1px 10px rgba(179, 198, 228, 0.7)',
              }}
            >
              <Flex justify='space-between'>
                <Link href='/' passHref>
                  <LineHeightFreeAnchor>
                    <Image src={'/logo-horizontal.svg'} alt='logo' />
                  </LineHeightFreeAnchor>
                </Link>
                {!isMenuCollapsed && <TopMenu theme={theme} />}
                {isMenuCollapsed && (
                  <Button
                    size='lg'
                    variant='link'
                    my={'auto'}
                    onClick={() => setIsDrawerVisible(!isDrawerVisible)}
                  >
                    <MenuOutlined
                      style={{ fontSize: 28, color: theme.colors.primary }}
                    />
                  </Button>
                )}
              </Flex>
            </Box>
          }
          footer={
            <Box
              mt={7}
              bg='background.dark'
              // @ts-ignore
              style={{ zIndex: 1, textAlign: 'center' }}
            >
              <FooterContent />
            </Box>
          }
        >
          {children}
        </Layout>

        <Drawer
          isOpen={isMenuCollapsed && isDrawerVisible}
          title='Menu'
          size='sm'
          placement='right'
          onClose={() => setIsDrawerVisible(false)}
        >
          <TopMenu
            closeDrawer={() => setIsDrawerVisible(false)}
            theme={theme}
          />
        </Drawer>
      </>
    );
  },
);
