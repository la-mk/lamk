import React from 'react';
import { StoreContents } from '@lamk/la-sdk/dist/models/storeContents';
import { Empty, Paragraph } from '@lamk/blocks-ui';
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
          return <Paragraph>{paragraph}</Paragraph>;
        })
      ) : (
        <Empty mt={5} description={t('store.no-aboutus-information')} />
      )}
    </Page>
  );
};
