import React from 'react';
import { StoreContents } from '@la-mk/la-sdk/dist/models/storeContents';
import { MarkdownViewer, Result } from '@la-mk/blocks-ui';
import { useTranslation } from '../../common/i18n';
import { Page } from '../shared/Page';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';

interface AboutUsProps {
  aboutUs: StoreContents['aboutUs'] | undefined;
}

export const AboutUs = ({ aboutUs }: AboutUsProps) => {
  const { t } = useTranslation();
  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/about', title: t('pages.aboutUs') },
  ]);

  return (
    <Page maxWidth={'86rem'} title={t('pages.aboutUs')}>
      {aboutUs?.description ? (
        <MarkdownViewer titleLevelOffset={1}>
          {aboutUs.description}
        </MarkdownViewer>
      ) : (
        <Result status='empty' description={t('store.noAboutusInformation')} />
      )}
    </Page>
  );
};
