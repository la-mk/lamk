import React from 'react';
import { useTranslation } from '../../common/i18n';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';
import { Page } from '../shared/Page';
import { FlexGrid, Flex, Box, Paragraph, Text } from '@sradevski/blocks-ui';
import { HoverableLink } from '../shared/components/HoverableLink';
import { CustomCard } from '../shared/components/CustomCard';

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
    <Page maxWidth={1280} title={t('pages.legal')}>
      <Paragraph textAlign='center'>{t('legal.legalExplanation')}</Paragraph>

      <Flex mt={5} align='center' justify='center' wrap='wrap'>
        {submenus.map(submenu => {
          return (
            <Box m={3}>
              <HoverableLink key={submenu.link} href={submenu.link}>
                <CustomCard minWidth={260}>
                  <Flex align='center' justify='center'>
                    <Text>{submenu.text}</Text>
                  </Flex>
                </CustomCard>
              </HoverableLink>
            </Box>
          );
        })}
      </Flex>
    </Page>
  );
};
