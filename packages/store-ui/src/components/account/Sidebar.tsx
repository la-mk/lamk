import { Box, Button, Flex, Text } from '@sradevski/blocks-ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '@chakra-ui/react';
import React from 'react';
import {
  ArrowRightOutlined,
  HomeOutlined,
  LockOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { TFunction } from 'next-i18next';
import { useTranslation } from '../../common/i18n';

const getAccountMenu = (t: TFunction) => [
  {
    title: t('pages.personalDetails'),
    icon: <UserOutlined />,
    href: '/account/personal',
  },
  {
    title: t('pages.changePassword'),
    icon: <LockOutlined />,
    href: '/account/change-password',
  },
  {
    title: t('pages.myAddresses'),
    icon: <HomeOutlined />,
    href: '/account/addresses',
  },
  {
    title: t('pages.myOrders'),
    icon: <ShoppingOutlined />,
    href: '/account/orders',
  },
];

export const Sidebar = () => {
  const { t } = useTranslation();
  const { pathname } = useRouter();
  const theme = useTheme();

  return (
    <Flex
      direction='column'
      align='center'
      // @ts-ignore
      borderRight={`1px solid ${theme.colors.gray['200']}`}
      height='100%'
      width='14rem'
    >
      <Flex align='center' direction='column' p={4}>
        <Text color='mutedText.dark'>Welcome back,</Text>
        <Text size='lg'>Dear Guest</Text>
      </Flex>

      <Flex direction='column' align='center' width='100%'>
        {getAccountMenu(t).map(item => {
          const isCurrent = pathname.startsWith(item.href);
          return (
            <Link href={item.href} passHref>
              <Button
                size='md'
                isFullWidth
                variant='ghost'
                // @ts-ignore
                borderRadius='none'
                // @ts-ignore
                bg={isCurrent ? 'background.light' : undefined}
                borderLeft={
                  isCurrent
                    ? `2px solid ${theme.colors.primary['500']}`
                    : undefined
                }
                my={2}
                as='a'
                leftIcon={item.icon}
              >
                <Flex align='center' justify='space-between' width='100%'>
                  {item.title}
                  <Text as='div' size='xs' ml='auto'>
                    <ArrowRightOutlined />
                  </Text>
                </Flex>
              </Button>
            </Link>
          );
        })}
      </Flex>
    </Flex>
  );
};
