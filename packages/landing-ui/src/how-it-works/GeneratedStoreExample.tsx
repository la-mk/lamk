import React from 'react';
import { Title, Text, Image, Flex, Box } from '@sradevski/blocks-ui';
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
      <Text maxWidth={620} textAlign='center'>
        {t('howItWorks.getModernStoreDetails')}
      </Text>
      <Text
        mt={1}
        mb={4}
        fontSize={0}
        color='mutedText.dark'
        maxWidth={620}
        textAlign='center'
      >
        *{t('howItWorks.getModernStoreSmallPrint')}
      </Text>
      <Box display={['none', 'block', 'block']}>
        <Image
          src='/products-list-illustration.svg'
          alt='producs list illustration'
        />
      </Box>
      <Box display={['block', 'none', 'none']}>
        <Image
          src='/products-list-mobile.svg'
          alt='product list illustration for mobile'
        />
      </Box>
    </Flex>
  );
};
