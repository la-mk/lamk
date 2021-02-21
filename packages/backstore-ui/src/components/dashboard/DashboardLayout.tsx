import React from 'react';
import {
  Layout,
  Flex,
  Box,
  Button,
  Divider,
  hooks,
  LanguagePicker,
} from '@la-mk/blocks-ui';
import {
  ShoppingBag,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Tag,
  Truck,
  Grid,
  Home,
  Briefcase,
} from 'react-feather';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { Location } from 'history';
import { Account } from './Account';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  location: Location;
}

const SiderContainer = styled(Box)<{ isCollapsed: boolean }>`
  width: ${props => (props.isCollapsed ? '64px' : '192px')};
`;

const FixedSider = styled(Flex)`
  height: 100vh;
  position: fixed;
  left: 0;
`;

const TopMenu = ({ isSidebarCollapsed, i18n }: any) => {
  return (
    <Flex py={4} px={3} direction='column' align='center' justify='center'>
      <Account isSidebarCollapsed={isSidebarCollapsed} />
    </Flex>
  );
};

const DashboardLayoutBase = ({ children, location }: DashboardLayoutProps) => {
  const isInitialCollapsed = hooks.useBreakpoint([true, false, false]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(
    isInitialCollapsed,
  );
  const { t, i18n } = useTranslation();

  return (
    <>
      <Layout
        leftSider={
          <SiderContainer isCollapsed={isSidebarCollapsed} bg='secondary'>
            <FixedSider pt={4} width='inherit' direction='column' bg='inherit'>
              <TopMenu isSidebarCollapsed={isSidebarCollapsed} i18n={i18n} />
              <Divider my={2} />
              <Sidebar
                isCollapsed={isSidebarCollapsed}
                currentKey={location.pathname}
                items={[
                  {
                    icon: (props: any) => <Home size='1rem' {...props} />,
                    title: t('common.summary'),
                    href: '/dashboard/summary',
                  },

                  {
                    icon: (props: any) => (
                      <ShoppingBag size='1rem' {...props} />
                    ),
                    title: t('commerce.order_plural'),
                    href: '/dashboard/orders',
                  },

                  {
                    icon: (props: any) => <Grid size='1rem' {...props} />,
                    title: t('commerce.product_plural'),
                    href: '/dashboard/products',
                  },

                  {
                    icon: (props: any) => <Truck size='1rem' {...props} />,
                    title: t('commerce.delivery'),
                    href: '/dashboard/delivery',
                  },

                  {
                    icon: (props: any) => <CreditCard size='1rem' {...props} />,
                    title: t('commerce.payment'),
                    href: '/dashboard/payment',
                  },

                  {
                    icon: (props: any) => <Tag size='1rem' {...props} />,
                    title: t('commerce.campaign_plural'),
                    href: '/dashboard/campaigns',
                  },

                  {
                    icon: (props: any) => <Briefcase size='1rem' {...props} />,
                    title: t('commerce.store'),
                    href: '/dashboard/store',
                  },
                ]}
              />

              <Box mt='auto'>
                <Flex justify={'center'} my={3} px={4} color='mutedText.light'>
                  <LanguagePicker
                    darkMode
                    languageCode={i18n.language}
                    onChangeLanguageCode={key => i18n.changeLanguage(key)}
                  />
                </Flex>
                <Divider mt={2} />
                <Button
                  isFullWidth
                  py={4}
                  variant='link'
                  onClick={() => setIsSidebarCollapsed(x => !x)}
                  leftIcon={
                    isSidebarCollapsed ? (
                      <ChevronRight size='1.2rem' />
                    ) : (
                      <ChevronLeft size='1.2rem' />
                    )
                  }
                />
              </Box>
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
