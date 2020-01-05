import React from 'react';
import { StoreContents } from '@sradevski/la-sdk/dist/models/storeContents';
import { Empty, Paragraph } from '@sradevski/blocks-ui';
import { useTranslation } from '../../common/i18n';
import { Page } from '../shared/Page';

interface AboutUsProps {
  aboutUs: StoreContents['aboutUs'] | undefined;
}

export const AboutUs = ({ aboutUs }: AboutUsProps) => {
  const { t } = useTranslation();
  let paragraphs;
  if (aboutUs && aboutUs.description) {
    paragraphs = aboutUs.description.split(/\n/);
  }

  return (
    <Page title={t('pages.aboutUs')}>
      {paragraphs ? (
        paragraphs.map(paragraph => {
          return (
            <Paragraph key={paragraph.slice(0, 10)}>{paragraph}</Paragraph>
          );
        })
      ) : (
        <Empty mt={6} description={t('store.noAboutusInformation')} />
      )}
    </Page>
  );
};
