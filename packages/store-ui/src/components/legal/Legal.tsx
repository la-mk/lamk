import React from 'react';
import { useTranslation } from '../../common/i18n';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';
import { Page } from '../shared/Page';
import { Flex, Box, Text, Card } from '@sradevski/blocks-ui';
import { HoverableLink } from '../shared/components/HoverableLink';

export const Legal = () => {
  const { t } = useTranslation();
  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/legal', title: t('pages.legal') },
  ]);

  const submenus = [
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
  ];

  return (
    <Page maxWidth={'86rem'} title={t('pages.legal')}>
      <Text as='p' align='center'>
        {t('legal.legalExplanation')}
      </Text>

      <Flex mt={7} align='center' justify='center' wrap='wrap'>
        {submenus.map(submenu => {
          return (
            <Box m={3}>
              <HoverableLink key={submenu.link} href={submenu.link}>
                <Card
                  minWidth={'16rem'}
                  textAlign='center'
                  bg='background.light'
                  // @ts-ignore
                  borderColor='background.light'
                >
                  <Text>{submenu.text}</Text>
                </Card>
              </HoverableLink>
            </Box>
          );
        })}
      </Flex>
    </Page>
  );
};
