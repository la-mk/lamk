import React from 'react';
import {
  Layout,
  Flex,
  Text,
  Menu,
  MenuItem,
  LanguagePicker,
  Box,
  Button,
  Divider,
  hooks,
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
  RightOutlined,
  LeftOutlined,
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

const TopMenuContainer = styled(Flex)`
  color: white;
`;

const SiderContainer = styled(Box)<{ isCollapsed: boolean }>`
  width: ${props => (props.isCollapsed ? '64px' : '192px')};
`;

const FixedSider = styled(Flex)`
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
`;

const CustomMenuItem = styled(MenuItem)<{ isCollapsed: boolean }>`
  padding-left: ${props => (props.isCollapsed ? '8px !important' : '')};
  padding-right: ${props => (props.isCollapsed ? '8px !important' : '')};
  display: ${props => (props.isCollapsed ? 'flex' : '')};
  align-items: center;
  justify-content: center;
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
  const isInitialCollapsed = hooks.useBreakpoint([true, false, false]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(
    isInitialCollapsed,
  );
  const { t, i18n } = useTranslation();

  // Not a very clean solution, but it will do for now
  const matches = location.pathname.match(/\/dashboard\/(\w*)(\/?)/);
  const selectedKeys = matches && matches.length > 1 ? [matches[1]] : [];

  return (
    <>
      <Layout
        leftSider={
          <SiderContainer isCollapsed={isSidebarCollapsed} bg='secondary'>
            <FixedSider width='inherit' direction='column' bg='inherit'>
              <TopMenu isSidebarCollapsed={isSidebarCollapsed} i18n={i18n} />

              <Menu
                style={{ height: '100%' }}
                theme='dark'
                mode='inline'
                selectedKeys={selectedKeys}
              >
                <CustomMenuItem isCollapsed={isSidebarCollapsed} key='summary'>
                  <DashboardOutlined
                    style={{
                      fontSize: isSidebarCollapsed ? '20px' : undefined,
                      marginRight: isSidebarCollapsed ? 0 : undefined,
                    }}
                  />
                  <Text display={isSidebarCollapsed ? 'none' : undefined}>
                    {t('common.summary')}
                  </Text>
                  <Link to='/dashboard/summary' />
                </CustomMenuItem>

                <CustomMenuItem isCollapsed={isSidebarCollapsed} key='orders'>
                  <ShoppingCartOutlined
                    style={{
                      fontSize: isSidebarCollapsed ? '20px' : undefined,
                      marginRight: isSidebarCollapsed ? 0 : undefined,
                    }}
                  />
                  <Text display={isSidebarCollapsed ? 'none' : undefined}>
                    {t('commerce.order_plural')}
                  </Text>
                  <Link to='/dashboard/orders' />
                </CustomMenuItem>

                <CustomMenuItem isCollapsed={isSidebarCollapsed} key='products'>
                  <AppstoreOutlined
                    style={{
                      fontSize: isSidebarCollapsed ? '20px' : undefined,
                      marginRight: isSidebarCollapsed ? 0 : undefined,
                    }}
                  />
                  <Text display={isSidebarCollapsed ? 'none' : undefined}>
                    {t('commerce.product_plural')}
                  </Text>
                  <Link to='/dashboard/products' />
                </CustomMenuItem>

                <CustomMenuItem isCollapsed={isSidebarCollapsed} key='delivery'>
                  <CodeSandboxOutlined
                    style={{
                      fontSize: isSidebarCollapsed ? '20px' : undefined,
                      marginRight: isSidebarCollapsed ? 0 : undefined,
                    }}
                  />
                  <Text display={isSidebarCollapsed ? 'none' : undefined}>
                    {t('commerce.delivery')}
                  </Text>
                  <Link to='/dashboard/delivery' />
                </CustomMenuItem>

                <CustomMenuItem isCollapsed={isSidebarCollapsed} key='payment'>
                  <BankOutlined
                    style={{
                      fontSize: isSidebarCollapsed ? '20px' : undefined,
                      marginRight: isSidebarCollapsed ? 0 : undefined,
                    }}
                  />
                  <Text display={isSidebarCollapsed ? 'none' : undefined}>
                    {t('commerce.payment')}
                  </Text>
                  <Link to='/dashboard/payment' />
                </CustomMenuItem>

                <CustomMenuItem
                  isCollapsed={isSidebarCollapsed}
                  key='campaigns'
                >
                  <TagOutlined
                    style={{
                      fontSize: isSidebarCollapsed ? '20px' : undefined,
                      marginRight: isSidebarCollapsed ? 0 : undefined,
                    }}
                  />
                  <Text display={isSidebarCollapsed ? 'none' : undefined}>
                    {t('commerce.campaign_plural')}
                  </Text>
                  <Link to='/dashboard/campaigns' />
                </CustomMenuItem>

                <CustomMenuItem isCollapsed={isSidebarCollapsed} key='store'>
                  <ShopOutlined
                    style={{
                      fontSize: isSidebarCollapsed ? '20px' : undefined,
                      marginRight: isSidebarCollapsed ? 0 : undefined,
                    }}
                  />
                  <Text display={isSidebarCollapsed ? 'none' : undefined}>
                    {t('commerce.store')}
                  </Text>
                  <Link to='/dashboard/store' />
                </CustomMenuItem>

                {/* 
                <CustomMenuItem isCollapsed={isSidebarCollapsed} key='preferences'>
                  <SettingOutlined />
                  <Text>{t('common.preferences')}</Text>
                  <Link to='/dashboard/preferences' />
                </CustomMenuItem> 
              */}
                <CustomMenuItem isCollapsed={isSidebarCollapsed} key='language'>
                  <LanguagePicker
                    languageCode={i18n.language}
                    onChangeLanguageCode={key => i18n.changeLanguage(key)}
                  />
                </CustomMenuItem>
              </Menu>
              <Divider mt={2} />
              <Button
                py={4}
                variant='link'
                onClick={() => setIsSidebarCollapsed(x => !x)}
              >
                {isSidebarCollapsed ? <RightOutlined /> : <LeftOutlined />}
              </Button>
            </FixedSider>
          </SiderContainer>
        }
      >
        <Box bg='background.light'>
          <Box
            bg='white'
            minHeight={'calc(100vh - 32px)'}
            m={'16px'}
            // @ts-ignore
            style={{ overflowY: 'auto' }}
          >
            {children}
          </Box>
        </Box>
      </Layout>
    </>
  );
};

export const DashboardLayout = withRouter(DashboardLayoutBase);
