import React from 'react';
import { Layout, Sider, Content } from '../../component-lib/basic/Layout';
import { Flex } from '../../component-lib/basic/Flex';
import { Menu, MenuItem } from '../../component-lib/basic/Menu';
import { Icon } from '../../component-lib/basic/Icon';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { Location } from 'history';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  location: Location;
}

const FixedSider = styled(Sider)`
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
`;

const StyledContent = styled(Content)`
  overflow: initial;
  background: white;
`;

const TopMenuContainer = styled(Flex)`
  color: white;
`;

const DashboardLayoutBase = ({ children, location }: DashboardLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  // Not a very clean solution, but it will do for now
  const matches = location.pathname.match(/\/dashboard\/(\w*)(\/?)/);
  const selectedKeys = matches && matches.length > 1 ? [matches[1]] : [];

  return (
    <>
      <Layout>
        <FixedSider
          collapsible
          collapsed={isSidebarCollapsed}
          onCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <TopMenuContainer py={4} px={3}>
            Welcome xxx
          </TopMenuContainer>

          <Menu theme='dark' mode='inline' selectedKeys={selectedKeys}>
            <MenuItem key='summary'>
              <Icon type='dashboard' />
              <span>Summary</span>
              <Link to='/dashboard/summary' />
            </MenuItem>
            <MenuItem key='orders'>
              <Icon type='shopping-cart' />
              <span>Orders</span>
              <Link to='/dashboard/orders' />
            </MenuItem>
            <MenuItem key='products'>
              <Icon type='appstore' />
              <span>Products</span>
              <Link to='/dashboard/products' />
            </MenuItem>
            <MenuItem key='preferences'>
              <Icon type='setting' />
              <span>Preferences</span>
              <Link to='/dashboard/preferences' />
            </MenuItem>
          </Menu>
        </FixedSider>
        <StyledContent m={3}>{children}</StyledContent>
      </Layout>
    </>
  );
};

export const DashboardLayout = withRouter(DashboardLayoutBase);
