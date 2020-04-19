import React, { useState } from 'react';
import {
  Layout,
  Content,
  Header,
  Footer,
  Image,
  Flex,
  Button,
  Text,
  Drawer,
  hooks,
} from '@sradevski/blocks-ui';
import { MenuOutlined } from '@ant-design/icons';
import styled, { withTheme } from 'styled-components';
import Link from 'next/link';
import { TopMenu } from './TopMenu';

interface StoreLayoutProps {
  children?: React.ReactNode;
  theme: any;
}

// This makes sure the anchor is as high as its content
const LineHeightFreeAnchor = styled.a`
  line-height: 0;
  height: 56px;
  min-width: 56px;
  margin: 4px 0;
`;

export const LandingLayout = withTheme(
  ({ theme, children }: StoreLayoutProps) => {
    const isMenuCollapsed = hooks.useBreakpoint([true, false, false]);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    return (
      <>
        <Layout>
          <Header
            px={[2, 4, 5]}
            style={{
              backgroundColor: theme.colors.lightBackground,
              boxShadow: '0px -1px 10px rgba(179, 198, 228, 0.7)',
              zIndex: 3,
            }}
          >
            <Flex justifyContent='space-between'>
              <Link href='/' passHref>
                <LineHeightFreeAnchor style={{ display: 'flex' }}>
                  <Image maxHeight='100%' src={'/logo-full.svg'} alt='logo' />
                </LineHeightFreeAnchor>
              </Link>
              {!isMenuCollapsed && <TopMenu theme={theme} />}
              {isMenuCollapsed && (
                <Button
                  size='large'
                  type='link'
                  my={'auto'}
                  onClick={() => setIsDrawerVisible(!isDrawerVisible)}
                >
                  <MenuOutlined
                    style={{ fontSize: 28, color: theme.colors.primary }}
                  />
                </Button>
              )}
            </Flex>
          </Header>
          <Content style={{ backgroundColor: 'white' }}>{children}</Content>
          <Footer
            style={{ zIndex: 1, backgroundColor: theme.colors.darkBackground }}
            textAlign='center'
          >
            <Text color='white'>La.mk © 2020</Text>
          </Footer>
        </Layout>

        <Drawer
          bodyStyle={{
            padding: '12px 0',
            backgroundColor: theme.colors.lightBackground,
          }}
          headerStyle={{ backgroundColor: theme.colors.lightBackground }}
          title='Menu'
          placement='right'
          onClose={() => setIsDrawerVisible(false)}
          visible={isDrawerVisible}
        >
          <TopMenu theme={theme} />
        </Drawer>
      </>
    );
  },
);
