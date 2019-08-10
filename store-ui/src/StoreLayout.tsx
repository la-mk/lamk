import React from 'react';
import { Layout, Content, Header, Footer } from 'blocks-ui/dist/basic/Layout';
import { Flex } from 'blocks-ui/dist/basic/Flex';
import { Menu, MenuItem } from 'blocks-ui/dist/basic/Menu';
import styled from 'styled-components';
import { Icon } from 'blocks-ui/dist/basic/Icon';
import { Search } from 'blocks-ui/dist/basic/Input';

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
      <Layout>
        <Header style={{ background: 'white' }}>
          <Flex justifyContent='space-between'>
            <TopMenuContainer py={3}>Store logo</TopMenuContainer>
            <TopMenuContainer flex={'1 0 0'} mx={4} py={3}>
              <Search />
            </TopMenuContainer>
            <Menu
              style={{ lineHeight: '64px' }}
              mode='horizontal'
              // selectedKeys={selectedKeys}
            >
              <MenuItem key='products'>
                <span>Products</span>
                {/* <Link to='/store/products' /> */}
              </MenuItem>
              <MenuItem key='about-us'>
                <span>About us</span>
                {/* <Link to='/store/about-us' /> */}
              </MenuItem>
              <MenuItem height={'64px'} key='cart'>
                <Icon m={0} type='shopping-cart' />
                <span>Cart</span>
                {/* <Link to='/store/cart' /> */}
              </MenuItem>
            </Menu>
          </Flex>
        </Header>
        <StyledContent py={20}>{children}</StyledContent>
        <Footer style={{ textAlign: 'center' }}>
          La.mk ©2019 Created by La.mk
        </Footer>
      </Layout>
    </>
  );
};