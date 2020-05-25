import React from 'react';
import { StoreContents } from '@sradevski/la-sdk/dist/models/storeContents';
import { Empty, Paragraph } from '@sradevski/blocks-ui';
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
    <Page maxWidth={1280} title={t('pages.aboutUs')}>
      {paragraphs ? (
        paragraphs.map(paragraph => {
          return (
            <Paragraph textAlign='center' key={paragraph.slice(0, 10)}>
              {paragraph}
            </Paragraph>
          );
        })
      ) : (
        <Empty mt={6} description={t('store.noAboutusInformation')} />
      )}
    </Page>
  );
};
