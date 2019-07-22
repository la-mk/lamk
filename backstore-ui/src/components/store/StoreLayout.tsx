import React from 'react';
import {
  Layout,
  Content,
  Header,
  Footer,
} from '../../component-lib/basic/Layout';
import { Flex } from '../../component-lib/basic/Flex';
import { Menu, MenuItem } from '../../component-lib/basic/Menu';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { Location } from 'history';
import { Icon } from '../../component-lib/basic/Icon';
import { Search } from '../../component-lib/basic/Input';

interface StoreLayoutProps {
  children?: React.ReactNode;
  location: Location;
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

const StoreLayoutBase = ({ children, location }: StoreLayoutProps) => {
  // Not a very clean solution, but it will do for now
  const matches = location.pathname.match(/\/store\/([^/]*)(\/?)/);
  const selectedKeys = matches && matches.length > 1 ? [matches[1]] : [];

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
              selectedKeys={selectedKeys}
            >
              <MenuItem key='products'>
                <span>Products</span>
                <Link to='/store/products' />
              </MenuItem>
              <MenuItem key='about-us'>
                <span>About us</span>
                <Link to='/store/about-us' />
              </MenuItem>
              <MenuItem height={'64px'} key='cart'>
                <Icon m={0} type='shopping-cart' />
                <span>Cart</span>
                <Link to='/store/cart' />
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

export const StoreLayout = withRouter(StoreLayoutBase);
