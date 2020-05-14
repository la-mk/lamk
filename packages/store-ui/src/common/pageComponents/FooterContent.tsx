import React from 'react';
import {
  Button,
  Flex,
  Title,
  Image,
  Text,
  Collapse,
  CollapsePanel,
  Box,
  Divider,
} from '@sradevski/blocks-ui';
import Link from 'next/link';
import { useTranslation } from '../i18n';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { StoreFooterSection } from './StoreFooterSection';

const getMenus = (t: any): Menu[] => [
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

const Submenu = ({ submenus }: { submenus: Submenu[] }) => {
  return (
    <Flex flexDirection='column' alignItems='flex-start'>
      {submenus.map(submenu => {
        return (
          <Link key={submenu.link} href={submenu.link} passHref>
            <Button type='link'>{submenu.text}</Button>
          </Link>
        );
      })}
    </Flex>
  );
};

export const FooterContent = ({ store }: { store: Store }) => {
  const { t } = useTranslation();
  const menus = getMenus(t);

  return (
    <Box>
      <Flex
        flexDirection={['column', 'row', 'row']}
        justifyContent={'center'}
        alignItems='center'
      >
        <Box maxWidth={['100%', '25%', '25%']}>
          <StoreFooterSection store={store} />
        </Box>

        <Box display={['none', 'initial', 'initial']} mx={2}>
          <Divider height='100%' type='vertical' />
        </Box>

        <Box display={['none', 'initial', 'initial']}>
          {menus.map(menu => {
            return (
              <Flex
                flexDirection='column'
                alignItems='flex-start'
                key={menu.text}
                mr={4}
              >
                {menu.link && (
                  <Link key={menu.link} href={menu.link} passHref>
                    <Button type='link'>
                      <Title level={4}>{menu.text}</Title>
                    </Button>
                  </Link>
                )}
                {!menu.link && (
                  <Title mx={3} level={4}>
                    {menu.text}
                  </Title>
                )}
                <Submenu submenus={menu.submenus} />
              </Flex>
            );
          })}
        </Box>
        <Box width='100%' mt={[2, 2, 0]} display={['initial', 'none', 'none']}>
          <Collapse bordered={false} style={{ background: 'transparent' }}>
            {menus.map(menu => {
              return (
                <CollapsePanel key={menu.text} header={menu.text}>
                  <Submenu submenus={menu.submenus} />
                </CollapsePanel>
              );
            })}
          </Collapse>
        </Box>
        <Box mx={3} mt={3}>
          <Image
            width='140px'
            src={'/images/mastercard.svg'}
            alt='mastercard logo'
          />
          <Image width='120px' src={'/images/visa.svg'} alt='visa logo' />
        </Box>
      </Flex>
      <Box mt={4}>
        {/* TODO: Add Created by La.mk once the landing page is ready */}
        <Text type='secondary'>{store.name} © 2020</Text>
      </Box>
    </Box>
  );
};
