import React from 'react';
import { Layout, Sider, Content, Flex, Menu, MenuItem, Icon } from '@lamk/blocks-ui';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { Location } from 'history';
import { Account } from './Account';
import { useTranslation } from 'react-i18next';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  location: Location;
}

const FixedSider = styled(Sider)`
  overflow: auto;
  height: 100vh;
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
  const {t} = useTranslation();

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
            <Account />
          </TopMenuContainer>

          <Menu theme='dark' mode='inline' selectedKeys={selectedKeys}>
            <MenuItem key='summary'>
              <Icon type='dashboard' />
    <span>{t('common.summary')}</span>
              <Link to='/dashboard/summary' />
            </MenuItem>
            <MenuItem key='orders'>
              <Icon type='shopping-cart' />
              <span>{t('commerce.order_plural')}</span>
              <Link to='/dashboard/orders' />
            </MenuItem>
            <MenuItem key='products'>
              <Icon type='appstore' />
              <span>{t('commerce.product_plural')}</span>
              <Link to='/dashboard/products' />
            </MenuItem>
            <MenuItem key='store'>
              <Icon type='shop' />
              <span>{t('commerce.store')}</span>
              <Link to='/dashboard/store' />
            </MenuItem>
            
            <MenuItem key='delivery'>
              <Icon type='code-sandbox' />
              <span>{t('commerce.delivery')}</span>
              <Link to='/dashboard/delivery' />
            </MenuItem>
            
            <MenuItem key='preferences'>
              <Icon type='setting' />
              <span>{t('common.preferences')}</span>
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
