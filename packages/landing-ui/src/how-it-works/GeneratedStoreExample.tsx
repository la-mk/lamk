import React from 'react';
import { Heading, Text, Image, Flex, Box } from '@sradevski/blocks-ui';
import { useTranslation } from '../common/i18n';

export const GeneratedStoreExample = () => {
  const { t } = useTranslation();
  return (
    <Flex
      mt={100}
      maxWidth={980}
      mx='auto'
      px={3}
      align='center'
      justify='center'
      direction='column'
    >
      <Heading as='h3' align='center'>
        {t('howItWorks.getModernStore')}
      </Heading>
      <Text maxWidth={620} align='center'>
        {t('howItWorks.getModernStoreDetails')}
      </Text>
      <Text
        mt={1}
        mb={4}
        size='xs'
        color='mutedText.dark'
        maxWidth={620}
        align='center'
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
