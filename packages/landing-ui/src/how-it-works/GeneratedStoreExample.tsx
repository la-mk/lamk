import React from 'react';
import { Heading, Text, Image, Flex, Box } from '@sradevski/blocks-ui';
import { useTranslation } from '../common/i18n';

export const GeneratedStoreExample = () => {
  const { t } = useTranslation();
  return (
    <Flex
      mt={'6rem'}
      maxWidth={'60rem'}
      mx='auto'
      px={4}
      align='center'
      justify='center'
      direction='column'
    >
      <Heading as='h3' align='center' mb={5}>
        {t('howItWorks.getModernStore')}
      </Heading>
      <Text maxWidth={'40rem'} align='center'>
        {t('howItWorks.getModernStoreDetails')}
      </Text>
      <Text
        mt={2}
        mb={6}
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
