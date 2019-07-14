import React from 'react';
import { Layout, Sider, Content } from '../../component-lib/basic/Layout';
import { Flex } from '../../component-lib/basic/Flex';
import { Menu, MenuItem } from '../../component-lib/basic/Menu';
import { Icon } from '../../component-lib/basic/Icon';
import styled from 'styled-components';

interface DashboardLayoutProps {
  children: React.ReactNode;
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

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  //Set based on the route in the navbar.
  const [selectedKeys, setSelectedKeys] = React.useState(['orders']);

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

          <Menu
            theme='dark'
            mode='inline'
            selectedKeys={selectedKeys}
            onClick={({ key }) => setSelectedKeys([key])}
          >
            <MenuItem key='orders'>
              <Icon type='shopping-cart' />
              <span>Orders</span>
            </MenuItem>
            <MenuItem key='products'>
              <Icon type='appstore' />
              <span>Products</span>
            </MenuItem>
            <MenuItem key='preferences'>
              <Icon type='setting' />
              <span>Preferences</span>
            </MenuItem>
          </Menu>
        </FixedSider>
      </Layout>

      <Layout ml={200} height='100%'>
        <StyledContent m={3}>{children}</StyledContent>
      </Layout>
    </>
  );
};
