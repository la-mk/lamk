import React from 'react';
import {
  Menu,
  MenuItem,
  Button,
  hooks,
  Dropdown,
  Text,
} from '@sradevski/blocks-ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from '../common/i18n';
import { BlocksTheme } from '@sradevski/blocks-ui/dist/theme';

export const TopMenu = ({
  closeDrawer,
  theme,
}: {
  theme: BlocksTheme;
  closeDrawer?: () => void;
}) => {
  const mode = hooks.useBreakpoint(['vertical', 'vertical', 'horizontal']);
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
      <MenuItem p={0} key='home' mb={11} mx={[0, 1, 2]}>
        <Link href='/' passHref>
          <Button type='link'>{t('landing.homePage')}</Button>
        </Link>
      </MenuItem>
      <MenuItem p={0} key='how-it-works' mb={11} mx={[0, 1, 2]}>
        <Link href='/how-it-works' passHref>
          <Button type='link'>{t('landing.howItWorksPage')}</Button>
        </Link>
      </MenuItem>
      <MenuItem p={0} key='faq' mb={11} mx={[0, 1, 2]}>
        <Link href='/faq' passHref>
          <Button type='link'>{t('landing.faqPage')}</Button>
        </Link>
      </MenuItem>
      <MenuItem p={0} key='contact' mb={11} mx={[0, 1, 2]}>
        <Link href='/contact' passHref>
          <Button type='link'>{t('landing.contactUsPage')}</Button>
        </Link>
      </MenuItem>

      <MenuItem p={0} key='language' mb={11} mx={[0, 1, 2]}>
        <Dropdown
          placement='bottomLeft'
          overlay={
            <Menu
              selectedKeys={[i18n.language]}
              onClick={({ key }) => {
                i18n.changeLanguage(key);
              }}
            >
              <MenuItem key='mk'>
                <Text>Македонски</Text>
              </MenuItem>
              <MenuItem key='en'>
                <Text>English</Text>
              </MenuItem>
            </Menu>
          }
        >
          <Button width='100%' display='block' type='link'>
            <Text>
              <GlobalOutlined style={{ marginRight: 0 }} />{' '}
              {i18n.language.toUpperCase()}
            </Text>
          </Button>
        </Dropdown>
      </MenuItem>

      <MenuItem
        p={0}
        key='start-now'
        style={{ border: 'none' }}
        mb={11}
        mx={[0, 1, 2]}
      >
        <Link href='/' passHref>
          <Button mx={[2, 0, 0]} style={{ color: 'white' }} type='primary'>
            {t('actions.startNow')}
          </Button>
        </Link>
      </MenuItem>
    </Menu>
  );
};
