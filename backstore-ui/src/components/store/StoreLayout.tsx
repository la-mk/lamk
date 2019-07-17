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

interface StoreLayoutProps {
  children?: React.ReactNode;
  location: Location;
}

const StyledContent = styled(Content)`
  overflow: initial;
  background: white;
`;

const TopMenuContainer = styled(Flex)`
  color: white;
`;

const StoreLayoutBase = ({ children, location }: StoreLayoutProps) => {
  // Not a very clean solution, but it will do for now
  const matches = location.pathname.match(/\/store\/([^/]*)(\/?)/);
  const selectedKeys = matches && matches.length > 1 ? [matches[1]] : [];

  return (
    <>
      <Layout>
        <Header>
          <Flex justifyContent='space-between'>
            <TopMenuContainer>Welcome xxx</TopMenuContainer>
            <Menu
              style={{ lineHeight: '64px' }}
              theme='dark'
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
                <Icon style={{ margin: 0 }} mx={3} type='shopping-cart' />
                <Link to='/store/cart' />
              </MenuItem>
            </Menu>
          </Flex>
        </Header>
        <StyledContent px={50} py={20}>
          {children}
        </StyledContent>
        <Footer style={{ textAlign: 'center' }}>
          La.mk ©2019 Created by La.mk
        </Footer>
      </Layout>
    </>
  );
};

export const StoreLayout = withRouter(StoreLayoutBase);
