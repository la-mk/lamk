import { Box, Button, Flex, hooks, Text } from '@la-mk/blocks-ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { getUser } from '../../../src/state/modules/user/user.selector';
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
import { BlocksTheme } from '@la-mk/blocks-ui/dist/theme';
import { ClickableCard } from '../shared/ClickableCard';
import { User } from '@la-mk/la-sdk/dist/models/user';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';

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

const MenuButton = ({
  item,
  isCurrent,
  theme,
}: {
  item: any;
  isCurrent?: boolean;
  theme: BlocksTheme;
}) => {
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
          isCurrent ? `2px solid ${theme.colors.primary['500']}` : undefined
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
};

export const AccountMenu = () => {
  const { t } = useTranslation();
  const { pathname } = useRouter();
  const theme = useTheme();
  const user = useSelector(getUser);
  const isMobile = hooks.useBreakpoint([true, false, false]);
  useBreadcrumb([{ url: '/', title: t('pages.home') }]);

  return (
    <Flex
      direction='column'
      align='center'
      // @ts-ignore
      borderRight={[
        undefined,
        `1px solid ${theme.colors.gray['200']}`,
        `1px solid ${theme.colors.gray['200']}`,
      ]}
      height='100%'
      width={['100%', '14rem', '14rem']}
    >
      <Flex align='center' direction='column' p={4}>
        <Text color='mutedText.dark'>{t('common.welcomeBack')},</Text>
        <Text size='lg'>{user?.firstName ?? t('common.guest')}</Text>
      </Flex>

      <Flex direction='column' align='center' width='100%'>
        {getAccountMenu(t).map(item => {
          const isCurrent = pathname.startsWith(item.href);
          if (isMobile) {
            return (
              <Box m={3}>
                <ClickableCard
                  href={item.href}
                  title={item.title}
                  icon={item.icon}
                />
              </Box>
            );
          }
          return <MenuButton item={item} isCurrent={isCurrent} theme={theme} />;
        })}
      </Flex>
    </Flex>
  );
};
