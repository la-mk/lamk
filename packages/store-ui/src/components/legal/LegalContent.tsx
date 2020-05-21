import React from 'react';
import { Paragraph } from '@sradevski/blocks-ui';
import { Page } from '../shared/Page';

export const LegalContent = ({ title, body }) => {
  return (
    <Page maxWidth={1} title={title}>
      <Paragraph textAlign='center' style={{ whiteSpace: 'pre-wrap' }}>
        {body}
      </Paragraph>
    </Page>
  );
};
