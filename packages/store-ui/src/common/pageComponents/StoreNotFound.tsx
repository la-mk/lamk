import React from 'react';
import { Flex, Title, Paragraph, Button } from '@sradevski/blocks-ui';
import { TFunction } from 'next-i18next';

export const StoreNotFound = ({ t }: { t: TFunction }) => {
  return (
    <Flex height='100vh' width='100vw' align='center' justify='center'>
      <Flex
        maxWidth={'600px'}
        p={3}
        direction='column'
        align='center'
        justify='center'
      >
        <Title textAlign='center' mb={2} level={1} fontSize={[6, 6, 7]}>
          {t('results.storeNotFound')}
        </Title>
        <Paragraph textAlign='center' mb={4}>
          {t('results.storeNotFoundExplanation')}
        </Paragraph>
        <Button as='a' href='https://la.mk' target='_blank'>
          {t('actions.createStoreNow')}
        </Button>
      </Flex>
    </Flex>
  );
};
