import React from 'react';
import { Paragraph } from '@sradevski/blocks-ui';
import { Page } from '../shared/Page';

export const LegalContent = ({ title, body }) => {
  return (
    <Page title={title}>
      <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{body}</Paragraph>
    </Page>
  );
};
