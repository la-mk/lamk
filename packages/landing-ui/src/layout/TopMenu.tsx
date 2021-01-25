import React from 'react';
import { Button, Flex, hooks, LanguagePicker, Text } from '@la-mk/blocks-ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from '../common/i18n';

const MenuItem = ({
  title,
  href,
  isCurrentPath,
  onClick,
}: {
  title: string;
  href: string;
  isCurrentPath: (href: string) => boolean;
  onClick?: () => void;
}) => {
  const isMobile = hooks.useBreakpoint([true, true, false]);
  const isCurrent = isCurrentPath(href);
  return (
    <Flex
      mx={[0, 0, 1]}
      width='100%'
      align='center'
      justify={['flex-start', 'flex-start', 'center']}
      my={[2, 2, 0]}
      py={[1, 1, 0]}
      bg={isCurrent && isMobile ? 'primary.50' : undefined}
    >
      <Link href={href} passHref>
        <Button onClick={onClick} as='a' variant='ghost'>
          <Text color={isCurrent ? 'primary' : 'text.dark'}>{title}</Text>
        </Button>
      </Link>
    </Flex>
  );
};

export const TopMenu = ({ closeDrawer }: { closeDrawer?: () => void }) => {
  const { pathname } = useRouter();
  const { t, i18n } = useTranslation();
  // Not a very clean solution, but it will do for now
  const isCurrentPath = (href: string) => {
    return pathname === href;
  };

  return (
    <Flex
      direction={['column', 'column', 'row']}
      align={['flex-start', 'flex-start', 'center']}
      bg='background.light'
    >
      <MenuItem
        isCurrentPath={isCurrentPath}
        onClick={closeDrawer}
        href='/'
        title={t('landing.homePage')}
      />
      <MenuItem
        isCurrentPath={isCurrentPath}
        onClick={closeDrawer}
        href='/how-it-works'
        title={t('landing.howItWorksPage')}
      />
      <MenuItem
        isCurrentPath={isCurrentPath}
        onClick={closeDrawer}
        href='/faq'
        title={t('landing.faqPage')}
      />
      <MenuItem
        isCurrentPath={isCurrentPath}
        onClick={closeDrawer}
        href='/blog'
        title={t('landing.blogPage')}
      />
      <MenuItem
        isCurrentPath={isCurrentPath}
        onClick={closeDrawer}
        href='/contact'
        title={t('landing.contactUsPage')}
      />

      <Flex align='center' justify='center' mx={3} my={[3, 3, 0]}>
        <LanguagePicker
          languageCode={i18n.language}
          onChangeLanguageCode={key => i18n.changeLanguage(key)}
        />
      </Flex>

      <Flex
        width='100%'
        height='100%'
        align='center'
        justify='center'
        mx={['auto', 3, 0]}
        ml={[0, 0, 3]}
        my={[3, 3, 0]}
      >
        <Button
          as='a'
          mx={[2, 2, 0]}
          target='_blank'
          rel='noreferrer noopener'
          href='https://admin.la.mk'
        >
          {t('actions.startNow')}
        </Button>
      </Flex>
    </Flex>
  );
};
