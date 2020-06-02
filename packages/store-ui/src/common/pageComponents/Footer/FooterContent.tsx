import React from 'react';
import {
  Flex,
  Box,
  Divider,
  FooterContent as BaseFooterContent,
} from '@sradevski/blocks-ui';
import Link from 'next/link';
import { useTranslation } from '../../i18n';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { StoreFooterSection } from './StoreFooterSection';
import { SubFooter } from './SubFooter';
import { Menu } from '@sradevski/blocks-ui/dist/compound/FooterContent';

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
    ],
  },
];

export const FooterContent = ({ store }: { store: Store }) => {
  const { t } = useTranslation();

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
        <BaseFooterContent menus={getMenus(t)} Link={Link} />
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
};
