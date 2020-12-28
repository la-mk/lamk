import React from 'react';
import { Flex, Image, Text, Box } from '@sradevski/blocks-ui';
import { useTranslation } from '../common/i18n';

const Feature = ({ icon, text, ...props }) => {
  return (
    <Flex
      mx={[2, 3, 3]}
      width={180}
      minWidth={180}
      direction='column'
      align='center'
      justify='center'
      {...props}
    >
      <Box height={90} p={2}>
        <Image src={icon} alt='example logo' />
      </Box>
      <Text
        as='div'
        // @ts-ignore
        height={60}
        // @ts-ignore
        size={['xs', 'xs', 'sm']}
        align='center'
        color='secondary'
      >
        {text}
      </Text>
    </Flex>
  );
};

export const FeaturesHorizontal = props => {
  const { t } = useTranslation();

  return (
    <Flex
      mt={[80, 100, 120]}
      px={1}
      // @ts-ignore
      style={{ overflowY: 'auto' }}
      direction={'row'}
      align='center'
    >
      <Feature
        mx={undefined}
        mr={[2, 3, 4]}
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
        ml={[2, 3, 4]}
        mr='auto'
        icon='/feature-analytics.svg'
        text={t('landing.featureAnalytics')}
      />
    </Flex>
  );
};
