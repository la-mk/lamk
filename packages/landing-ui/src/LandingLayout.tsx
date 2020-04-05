import React from 'react';
import {
  Menu,
  Layout,
  Content,
  Header,
  Footer,
  Image,
  Flex,
  MenuItem,
  Button,
} from '@sradevski/blocks-ui';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface StoreLayoutProps {
  children?: React.ReactNode;
}

// This makes sure the anchor is as high as its content
const LineHeightFreeAnchor = styled.a`
  line-height: 0;
  height: 56px;
  min-width: 56px;
  margin: 4px 0;
`;

export const LandingLayout = ({ children }: StoreLayoutProps) => {
  const router = useRouter();
  // Not a very clean solution, but it will do for now
  const matches = router.pathname.match(/\/([^/]*)(\/?)/);
  const selectedKeys = matches && !!matches[1] ? [matches[1]] : ['home'];

  return (
    <>
      <Layout>
        <Header style={{ backgroundColor: 'white' }}>
          <Flex justifyContent='space-between'>
            <Link href='/' passHref>
              <LineHeightFreeAnchor style={{ display: 'flex' }}>
                <Image maxHeight='100%' src={'/some/path'} alt='logo' />
              </LineHeightFreeAnchor>
            </Link>

            <Menu mode='horizontal' selectedKeys={selectedKeys}>
              <MenuItem p={0} key='home'>
                <Link href='/' passHref>
                  <Button type='link'>Дома</Button>
                </Link>
              </MenuItem>
              <MenuItem p={0} key='how-it-works'>
                <Link href='/how-it-works' passHref>
                  <Button type='link'>Како функционира</Button>
                </Link>
              </MenuItem>
              <MenuItem p={0} key='faq'>
                <Link href='/faq' passHref>
                  <Button type='link'>ЧПП</Button>
                </Link>
              </MenuItem>
              <MenuItem p={0} key='contact'>
                <Link href='/contact' passHref>
                  <Button type='link'>Контакт</Button>
                </Link>
              </MenuItem>
            </Menu>
          </Flex>
        </Header>
        <Content style={{ backgroundColor: 'white' }}>{children}</Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </>
  );
};
