import React from 'react';
import { Text } from '@sradevski/blocks-ui';
import { Page } from '../shared/Page';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';
import { useTranslation } from '../../common/i18n';

export const LegalContent = ({ url, title, body }) => {
  const { t } = useTranslation();

  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/legal', title: t('pages.legal') },
    { url, title },
  ]);

  return (
    <Page maxWidth={'86rem'} title={title}>
      <Text align='justify' color='text.dark' as='p' whiteSpace='pre-wrap'>
        {body}
      </Text>
    </Page>
  );
};
