import React from 'react';
import {
  Divider,
  Flex,
  Box,
  FooterContent as BaseFooterContent,
  Text,
  Image,
  Title,
} from '@sradevski/blocks-ui';
import Link from 'next/link';
import { Menu } from '@sradevski/blocks-ui/dist/compound/FooterContent';
import { useTranslation } from '../common/i18n';
import {
  PhoneFilled,
  MailFilled,
  FacebookFilled,
  TwitterSquareFilled,
  InstagramFilled,
} from '@ant-design/icons';

const getMenus = (t: any): Menu[] => [
  {
    text: t('common.ourCompany'),
    link: '/',

    submenus: [
      {
        link: '/',
        text: t('landing.homePage'),
      },
      {
        link: '/how-it-works',
        text: t('landing.howItWorksPage'),
      },
      {
        link: '/faq',
        text: t('landing.faqPage'),
      },
      {
        link: '/contact',
        text: t('landing.contactUsPage'),
      },
    ],
  },
  {
    text: t('landing.resources'),

    submenus: [
      {
        link: 'https://admin.la.mk',
        text: t('landing.adminPanel'),
      },
      {
        link: 'https://demo.la.mk',
        text: t('landing.demoShop'),
      },
    ],
  },
  {
    text: t('pages.legal'),
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
        link: '/legal/privacy',
        text: t('pages.privacy'),
      },
    ],
  },
];

const ContactEntry = ({
  icon,
  value,
}: {
  icon: any;
  value?: string | number;
}) => {
  if (!value) {
    return null;
  }

  return (
    <Text my={1} color='primary'>
      {icon}
      <Text fontSize={0} color='text.light' ml={4}>
        {value}
      </Text>
    </Text>
  );
};

export const FooterContent = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Flex
        maxWidth={1280}
        px={[3, 4, 5]}
        pt={[3, 4, 5]}
        mx='auto'
        flexDirection={['column', 'column', 'row']}
        alignItems={['center', 'center', 'flex-start']}
        justifyContent={'space-between'}
      >
        <Box minWidth={192} mr={[0, 0, 4]}>
          <Flex flexDirection='column' alignItems={'flex-start'}>
            <Box maxHeight='96px' maxWidth='192px' width='100%' mb={5} p={2}>
              <Image src={'/logo-horizontal-inverse.svg'} alt='logo' />
            </Box>

            <Title mb={3} color='heading.light' level={4} fontSize={1}>
              {t('common.contactDetails').toUpperCase()}
            </Title>

            <ContactEntry icon={<PhoneFilled />} value={'+389 77 647 585'} />
            <ContactEntry icon={<MailFilled />} value={'contact@la.mk'} />
          </Flex>
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

      <Flex
        justifyContent={['center', 'space-between', 'space-between']}
        alignItems='center'
        px={[3, 4, 5]}
        flexDirection={['column', 'row', 'row']}
      >
        <Text color='text.light' fontSize={0} mr={[0, 3, 3]} mb={[3, 0, 0]}>
          la.mk © 2020 All rights reserved
        </Text>

        <Flex
          mt={[3, 0, 0]}
          ml={[0, 3, 3]}
          justifyContent='center'
          alignItems='center'
        >
          <a
            href='https://www.facebook.com/Lamk-102161548245479'
            target='_blank'
            rel='noreferrer noopener'
          >
            <Text px={2} fontSize={3} color='text.light'>
              <FacebookFilled />
            </Text>
          </a>

          <a
            href='https://www.instagram.com/_la.mk/'
            target='_blank'
            rel='noreferrer noopener'
          >
            <Text px={2} fontSize={3} color='text.light'>
              <InstagramFilled />
            </Text>
          </a>

          <a
            href='https://twitter.com/__lamk'
            target='_blank'
            rel='noreferrer noopener'
          >
            <Text px={2} fontSize={3} color='text.light'>
              <TwitterSquareFilled />
            </Text>
          </a>
        </Flex>
      </Flex>
    </Box>
  );
};
