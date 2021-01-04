import React from 'react';
import { Flex, Image, Text, Box } from '@la-mk/blocks-ui';
import { useTranslation } from '../common/i18n';

const Feature = ({ icon, text, ...props }) => {
  return (
    <Flex
      mx={[3, 5, 5]}
      width={'12rem'}
      minWidth={'12rem'}
      height={'10rem'}
      direction='column'
      align='center'
      justify='center'
      {...props}
    >
      <Box height={'6rem'} p={3}>
        <Image src={icon} alt='example logo' />
      </Box>
      <Text size={'md'} align='center' color='secondary'>
        {text}
      </Text>
    </Flex>
  );
};

export const FeaturesHorizontal = props => {
  const { t } = useTranslation();

  return (
    <Flex
      mt={[14, 16, 20]}
      px={3}
      // @ts-ignore
      style={{ overflowY: 'auto' }}
      direction={'row'}
      align='center'
    >
      <Feature
        mx={undefined}
        mr={[3, 4, 5]}
        ml='auto'
        icon='/feature-domain.svg'
        text={t('landing.featureFreeDomain')}
      />
      <Feature
        icon='/feature-unlimited.svg'
        text={t('landing.featureUnlimitedProductsStorage')}
      />
      <Feature
        icon='/feature-creditcard.svg'
        text={t('landing.featureCreditCardPayments')}
      />
      <Feature
        icon='/feature-campaigns.svg'
        text={t('landing.featureDiscountCampaigns')}
      />
      <Feature
        mx={undefined}
        ml={[3, 4, 5]}
        mr='auto'
        icon='/feature-analytics.svg'
        text={t('landing.featureAnalytics')}
      />
    </Flex>
  );
};
