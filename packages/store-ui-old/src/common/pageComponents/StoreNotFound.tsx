import React from 'react';
import { Flex, Heading, Button, Text } from '@la-mk/blocks-ui';
import { TFunction } from 'next-i18next';

export const StoreNotFound = ({ t }: { t: TFunction }) => {
  return (
    <Flex height='100vh' width='100vw' align='center' justify='center'>
      <Flex
        maxWidth={'46rem'}
        p={3}
        direction='column'
        align='center'
        justify='center'
      >
        <Heading align='center' mb={2} as='h1' size={'2xl'}>
          {t('results.storeNotFound')}
        </Heading>
        <Text as='p' align='center' mb={4}>
          {t('results.storeNotFoundExplanation')}
        </Text>
        <Button as='a' href='https://la.mk' target='_blank'>
          {t('actions.createStoreNow')}
        </Button>
      </Flex>
    </Flex>
  );
};
