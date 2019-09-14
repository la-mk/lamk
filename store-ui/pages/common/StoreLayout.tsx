import React from 'react';
import {
  Menu,
  MenuItem,
  Flex,
  Search,
  Layout,
  Content,
  Header,
  Footer,
  Button,
} from 'blocks-ui';
import styled from 'styled-components';
import Link from 'next/link';
import { Store } from 'la-sdk/dist/models/store';
import { sdk } from 'la-sdk';
import { useRouter } from 'next/router';

interface StoreLayoutProps {
  store: Store;
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

const SizedSearch = styled(Search)`
  max-width: 400px;
  min-width: 80px;
`;

const BorderedHeader = styled(Header)`
  background: white;
  border-bottom: 1px solid #e8e8e8;
`;

export const StoreLayout = ({ store, children }: StoreLayoutProps) => {
  const router = useRouter();
  // Not a very clean solution, but it will do for now
  const matches = router.pathname.match(/\/([^/]*)(\/?)/);
  const selectedKeys = matches && matches.length > 1 ? [matches[1]] : [];

  return (
    <>
      <Layout theme='dark'>
        <BorderedHeader>
          <Flex justifyContent='space-between'>
            <Link href='/' passHref>
              <LineHeightFreeAnchor>
                <img
                  height='100%'
                  src={sdk.artifact.getUrlForArtifact(store.logo)}
                  alt='logo'
                />
              </LineHeightFreeAnchor>
            </Link>
            <SizedSearch mx={4} my={3} />
            <Menu mode='horizontal' selectedKeys={selectedKeys}>
              <MenuItem p={0} key='products'>
                <Link href='/products' passHref>
                  <Button type='link'>Products</Button>
                </Link>
              </MenuItem>
              <MenuItem p={0} key='about'>
                <Link href='/about' passHref>
                  <Button type='link'>About us</Button>
                </Link>
              </MenuItem>
              <MenuItem p={0} key='cart'>
                <Link href='/cart' passHref>
                  <Button icon='shopping-cart' type='link'></Button>
                </Link>
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
