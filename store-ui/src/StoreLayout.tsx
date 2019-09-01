import React from 'react';
import {
  Menu,
  MenuItem,
  Icon,
  Flex,
  Search,
  Layout,
  Content,
  Header,
  Footer,
} from 'blocks-ui';
import styled from 'styled-components';
import { CategoriesList } from './CategoriesList';
import Link from 'next/link';

interface StoreLayoutProps {
  children?: React.ReactNode;
}

const StyledContent = styled(Content)`
  overflow: initial;
  background: white;
`;

const TopMenuContainer = styled(Flex)`
  color: black;
  line-height: 32px;
  max-width: 40%;
`;

export const StoreLayout = ({ children }: StoreLayoutProps) => {
  // Not a very clean solution, but it will do for now
  // const matches = location.pathname.match(/\/store\/([^/]*)(\/?)/);
  // const selectedKeys = matches && matches.length > 1 ? [matches[1]] : [];

  return (
    <>
      <Layout theme='dark'>
        <Header style={{ background: 'white' }}>
          <Flex justifyContent='space-between'>
            <TopMenuContainer width='280px' px={20} py={3}>
              Store logo
            </TopMenuContainer>
            <TopMenuContainer mx={'auto'} flex={'1 0 0'} py={3}>
              <Search />
            </TopMenuContainer>
            <Menu
              width='280px'
              style={{ lineHeight: '64px' }}
              mode='horizontal'
              // selectedKeys={selectedKeys}
            >
              <MenuItem key='products'>
                <Link href='/products'>
                  <a>Products</a>
                </Link>
              </MenuItem>
              <MenuItem key='about-us'>
                <span>About us</span>
                {/* <Link to='/store/about-us' /> */}
              </MenuItem>
              <MenuItem key='cart'>
                <Icon type='shopping-cart' />
                <span>Cart</span>
              </MenuItem>
            </Menu>
          </Flex>
        </Header>
        <StyledContent>
          <CategoriesList />
          <Flex flexDirection='column' py={4}>
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
