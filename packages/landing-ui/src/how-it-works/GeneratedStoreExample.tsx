import React from 'react';
import { Title, Text, Image, Flex } from '@sradevski/blocks-ui';
import { useTranslation } from '../common/i18n';

export const GeneratedStoreExample = () => {
  const { t } = useTranslation();
  return (
    <Flex
      mt={100}
      maxWidth={980}
      mx='auto'
      px={3}
      alignItems='center'
      justifyContent='center'
      flexDirection='column'
    >
      <Title level={3} textAlign='center'>
        {t('howItWorks.getModernStore')}
      </Title>
      <Text maxWidth={620} textAlign='center' mb={4}>
        {t('howItWorks.getModernStoreDetails')}
      </Text>
      <Image
        display={['none', 'block', 'block']}
        src='/products-list-illustration.svg'
      />
      <Image
        display={['block', 'none', 'none']}
        src='/products-list-mobile.svg'
      />
    </Flex>
  );
};
