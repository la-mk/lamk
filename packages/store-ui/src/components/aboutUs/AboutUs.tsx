import React from 'react';
import { StoreContents } from '@la-mk/la-sdk/dist/models/storeContents';
import { Result, Text } from '@la-mk/blocks-ui';
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

  let paragraphs;
  if (aboutUs && aboutUs.description) {
    paragraphs = aboutUs.description.split(/\n/);
  }

  return (
    <Page maxWidth={'86rem'} title={t('pages.aboutUs')}>
      {paragraphs ? (
        paragraphs.map(paragraph => {
          return (
            <Text as='p' align='center' key={paragraph.slice(0, 16)}>
              {paragraph}
            </Text>
          );
        })
      ) : (
        <Result status='empty' description={t('store.noAboutusInformation')} />
      )}
    </Page>
  );
};
