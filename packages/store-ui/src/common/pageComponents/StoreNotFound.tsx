import React from 'react';
import { Flex, Paragraph, Button, Display } from '@sradevski/blocks-ui';
import { TFunction } from 'next-i18next';

export const StoreNotFound = ({ t }: { t: TFunction }) => {
  return (
    <Flex
      height='100vh'
      width='100vw'
      alignItems='center'
      justifyContent='center'
    >
      <Flex
        maxWidth={600}
        p={3}
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
      >
        <Display
          as='h1'
          textAlign='center'
          mb={2}
          size={['small', 'small', 'medium']}
        >
          {t('results.storeNotFound')}
        </Display>
        <Paragraph textAlign='center' mb={4}>
          {t('results.storeNotFoundExplanation')}
        </Paragraph>
        <a href='https://la.mk' target='_blank'>
          <Button size='large'>{t('actions.createStoreNow')}</Button>
        </a>
      </Flex>
    </Flex>
  );
};
