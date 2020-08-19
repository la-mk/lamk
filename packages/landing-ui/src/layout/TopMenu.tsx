import React from 'react';
import {
  Menu,
  MenuItem,
  Button,
  hooks,
  Flex,
  LanguagePicker,
} from '@sradevski/blocks-ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from '../common/i18n';
import { BlocksTheme } from '@sradevski/blocks-ui/dist/theme';

export const TopMenu = ({
  closeDrawer,
  theme,
}: {
  theme: BlocksTheme;
  closeDrawer?: () => void;
}) => {
  const mode: 'vertical' | 'horizontal' = hooks.useBreakpoint([
    'vertical',
    'vertical',
    'horizontal',
  ]);
  const router = useRouter();
  const { t, i18n } = useTranslation();
  // Not a very clean solution, but it will do for now
  const matches = router.pathname.match(/\/([^/]*)(\/?)/);
  const selectedKeys = matches && !!matches[1] ? [matches[1]] : ['home'];

  return (
    <Menu
      style={{
        border: 'none',
        backgroundColor: theme.colors.background.light,
      }}
      mode={mode}
      selectedKeys={selectedKeys}
      onClick={({ key }) => {
        if (key === 'language') {
          return;
        }
        closeDrawer?.();
      }}
    >
      <MenuItem p={0} key='home' mx={[0, 1, 2]}>
        <Link href='/' passHref>
          <Button type='link'>{t('landing.homePage')}</Button>
        </Link>
      </MenuItem>
      <MenuItem p={0} key='how-it-works' mx={[0, 1, 2]}>
        <Link href='/how-it-works' passHref>
          <Button type='link'>{t('landing.howItWorksPage')}</Button>
        </Link>
      </MenuItem>
      <MenuItem p={0} key='faq' mx={[0, 1, 2]}>
        <Link href='/faq' passHref>
          <Button type='link'>{t('landing.faqPage')}</Button>
        </Link>
      </MenuItem>
      <MenuItem p={0} key='contact' mx={[0, 1, 2]}>
        <Link href='/contact' passHref>
          <Button type='link'>{t('landing.contactUsPage')}</Button>
        </Link>
      </MenuItem>

      <MenuItem height='100%' py={0} px={2} key='language' mx={[0, 1, 2]}>
        <LanguagePicker
          languageCode={i18n.language}
          onChangeLanguageCode={(key) => i18n.changeLanguage(key)}
        />
      </MenuItem>

      <MenuItem
        height='100%'
        p={0}
        key='start-now'
        style={{ border: 'none' }}
        mx={[0, 1, 2]}
      >
        <Flex height='100%' alignItems='center' justifyContent='center'>
          <Button
            mx={[2, 0, 0]}
            style={{ color: 'white' }}
            type='primary'
            target='_blank'
            rel='noreferrer noopener'
            href='https://admin.la.mk'
          >
            {t('actions.startNow')}
          </Button>
        </Flex>
      </MenuItem>
    </Menu>
  );
};
