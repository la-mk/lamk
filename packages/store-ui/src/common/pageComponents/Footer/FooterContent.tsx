import React from 'react';
import {
  Flex,
  Box,
  Divider,
  FooterContent as BaseFooterContent,
} from '@la-mk/blocks-ui';
import Link from 'next/link';
import { useTranslation } from '../../i18n';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { StoreFooterSection } from './StoreFooterSection';
import { SubFooter } from './SubFooter';
import { Menu } from '@la-mk/blocks-ui/dist/compound/FooterContent';

const getMenus = (t: any): Menu[] => [
  {
    text: t('common.ourCompany'),
    link: '/',

    submenus: [
      {
        link: '/about',
        text: t('pages.aboutUs'),
      },
      {
        link: '/products',
        text: t('pages.product_plural'),
      },
      {
        link: '/account/personal',
        text: t('pages.myAccount'),
      },
      {
        link: '/account/orders',
        text: t('pages.myOrders'),
      },
    ],
  },
  {
    text: t('pages.legal'),
    link: '/legal',
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
      {
        link: '/legal/cookies-policy',
        text: t('pages.cookiesPolicy'),
      },
    ],
  },
];

export const FooterContent = ({ store }: { store: Store }) => {
  const { t } = useTranslation();

  return (
    <Box py={2}>
      <Flex
        maxWidth={'68rem'}
        px={[3, 4, 6]}
        pt={[4, 5, 6]}
        mx='auto'
        direction={['column', 'column', 'row']}
        align={['center', 'center', 'flex-start']}
        justify={'space-between'}
        color='text.light'
      >
        <Box mr={[0, 0, 5]}>
          <StoreFooterSection store={store} />
        </Box>
        <BaseFooterContent menus={getMenus(t)} Link={Link} />
      </Flex>

      <Divider display={['none', 'none', 'block']} mb={4} mt={6} />

      <SubFooter />
    </Box>
  );
};
