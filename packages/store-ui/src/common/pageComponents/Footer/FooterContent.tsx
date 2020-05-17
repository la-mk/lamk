import React from 'react';
import {
  Button,
  Flex,
  Title,
  Collapse,
  CollapsePanel,
  Box,
  Divider,
  Text,
} from '@sradevski/blocks-ui';
import Link from 'next/link';
import { useTranslation } from '../../i18n';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { StoreFooterSection } from './StoreFooterSection';
import { BlocksTheme } from '@sradevski/blocks-ui/dist/theme';
import styled, { withTheme } from 'styled-components';
import { SubFooter } from './SubFooter';

const getMenus = (t: any): Menu[] => [
  {
    text: t('common.ourCompany'),
    link: '/',

    submenus: [
      {
        link: '/about-us',
        text: t('pages.aboutUs'),
      },
      {
        link: '/products',
        text: t('pages.product_plural'),
      },
      {
        link: '/account',
        text: t('pages.myAccount'),
      },
      {
        link: '/orders',
        text: t('pages.myOrders'),
      },
    ],
  },
  {
    // TODO: Add a index page for /legal
    text: t('pages.legal'),
    // link: '/legal',
    submenus: [
      {
        link: '/legal/general-rules',
        text: t('pages.generalRules'),
      },
      {
        link: '/legal/terms-of-use',
        text: t('pages.termsOfUse'),
      },
      {
        link: '/legal/return-and-refund',
        text: t('pages.returnAndRefund'),
      },
      {
        link: '/legal/privacy',
        text: t('pages.privacy'),
      },
    ],
  },
];

interface Menu {
  text: string;
  link?: string;
  submenus: Array<Submenu>;
}

interface Submenu {
  link: string;
  text: string;
}

const CollapsePanelContainer = styled(Box)`
  & .ant-collapse-arrow {
    color: ${props => props.theme.colors.text.light} !important;
  }
`;

const Submenu = ({ submenus }: { submenus: Submenu[] }) => {
  return (
    <Flex flexDirection='column' alignItems='flex-start'>
      {submenus.map(submenu => {
        return (
          <Link key={submenu.link} href={submenu.link} passHref>
            <Button my={2} type='link'>
              {
                <Text fontSize={0} color='text.light'>
                  {submenu.text}
                </Text>
              }
            </Button>
          </Link>
        );
      })}
    </Flex>
  );
};

const SubmenuTitle = ({ menu }: { menu: Menu }) => {
  const title = (
    <Title mx={3} mb={3} fontSize={1} color='text.light' level={4}>
      {menu.text.toUpperCase()}
    </Title>
  );
  return (
    <>
      {menu.link && (
        <Link key={menu.link} href={menu.link}>
          <a style={{ textDecoration: 'none' }}>{title}</a>
        </Link>
      )}
      {!menu.link && title}
    </>
  );
};

export const FooterContent = withTheme(
  ({ theme, store }: { theme: BlocksTheme; store: Store }) => {
    const { t } = useTranslation();
    const menus = getMenus(t);

    return (
      <Box>
        <Flex
          maxWidth={1024}
          px={[3, 4, 6]}
          pt={[3, 4, 5]}
          mx='auto'
          flexDirection={['column', 'column', 'row']}
          alignItems={['center', 'center', 'flex-start']}
          justifyContent={'space-between'}
        >
          <Box mr={[0, 0, 5]}>
            <StoreFooterSection store={store} />
          </Box>

          <Box mt={[3, 0, 0]} display={['none', 'none', 'flex']}>
            <Flex>
              {menus.map(menu => {
                return (
                  <Flex
                    flexDirection='column'
                    alignItems='flex-start'
                    key={menu.text}
                    mx={4}
                  >
                    <SubmenuTitle menu={menu} />
                    <Submenu submenus={menu.submenus} />
                  </Flex>
                );
              })}
            </Flex>
          </Box>

          <CollapsePanelContainer
            width='100%'
            my={[4, 4, 0]}
            display={['block', 'block', 'none']}
          >
            <Collapse
              bordered={false}
              style={{
                background: 'transparent',
              }}
            >
              {menus.map(menu => {
                return (
                  <CollapsePanel
                    key={menu.text}
                    header={<Text color='text.light'>{menu.text}</Text>}
                  >
                    <Submenu submenus={menu.submenus} />
                  </CollapsePanel>
                );
              })}
            </Collapse>
          </CollapsePanelContainer>
        </Flex>

        <Divider
          display={['none', 'none', 'block']}
          bg='background.light'
          height='1px'
          mb={3}
          mt={6}
        />

        <SubFooter />
      </Box>
    );
  },
);
