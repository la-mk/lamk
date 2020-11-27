import React from 'react';
import {
  Layout,
  Sider,
  Content,
  Flex,
  Menu,
  MenuItem,
  LanguagePicker,
} from '@sradevski/blocks-ui';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  CodeSandboxOutlined,
  TagOutlined,
  ShopOutlined,
  // SettingOutlined,
  BankOutlined,
} from '@ant-design/icons';
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
  position: fixed;
  left: 0;
`;

const StyledContent = styled(Content)`
  overflow: initial;
  background: white;
  transition: margin 250ms;
`;

const TopMenuContainer = styled(Flex)`
  color: white;
`;

const TopMenu = ({ isSidebarCollapsed, i18n }: any) => {
  return (
    <TopMenuContainer
      py={4}
      px={3}
      direction='column'
      align='center'
      justify='center'
    >
      <Account isSidebarCollapsed={isSidebarCollapsed} />
    </TopMenuContainer>
  );
};

const DashboardLayoutBase = ({ children, location }: DashboardLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const { t, i18n } = useTranslation();

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
          <TopMenu isSidebarCollapsed={isSidebarCollapsed} i18n={i18n} />

          <Menu theme='dark' mode='inline' selectedKeys={selectedKeys}>
            <MenuItem key='summary'>
              <DashboardOutlined />
              <span>{t('common.summary')}</span>
              <Link to='/dashboard/summary' />
            </MenuItem>

            <MenuItem key='orders'>
              <ShoppingCartOutlined />
              <span>{t('commerce.order_plural')}</span>
              <Link to='/dashboard/orders' />
            </MenuItem>

            <MenuItem key='products'>
              <AppstoreOutlined />
              <span>{t('commerce.product_plural')}</span>
              <Link to='/dashboard/products' />
            </MenuItem>

            <MenuItem key='delivery'>
              <CodeSandboxOutlined />
              <span>{t('commerce.delivery')}</span>
              <Link to='/dashboard/delivery' />
            </MenuItem>

            <MenuItem key='payment'>
              <BankOutlined />
              <span>{t('commerce.payment')}</span>
              <Link to='/dashboard/payment' />
            </MenuItem>

            <MenuItem key='campaigns'>
              <TagOutlined />
              <span>{t('commerce.campaign_plural')}</span>
              <Link to='/dashboard/campaigns' />
            </MenuItem>

            <MenuItem key='store'>
              <ShopOutlined />
              <span>{t('commerce.store')}</span>
              <Link to='/dashboard/store' />
            </MenuItem>

            {/* 
            <MenuItem key='preferences'>
              <SettingOutlined />
              <span>{t('common.preferences')}</span>
              <Link to='/dashboard/preferences' />
            </MenuItem> */}
            <MenuItem key='language'>
              <LanguagePicker
                languageCode={i18n.language}
                onChangeLanguageCode={key => i18n.changeLanguage(key)}
              />
            </MenuItem>
          </Menu>
        </FixedSider>
        <StyledContent
          minHeight={'calc(100vh - 32px)'}
          ml={isSidebarCollapsed ? 96 : 216}
          my={16}
          mr={16}
        >
          {children}
        </StyledContent>
      </Layout>
    </>
  );
};

export const DashboardLayout = withRouter(DashboardLayoutBase);
