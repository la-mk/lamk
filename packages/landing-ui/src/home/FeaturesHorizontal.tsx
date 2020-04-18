import React from 'react';
import { Flex, Image, Text, Box } from '@sradevski/blocks-ui';

const Feature = ({ icon, text, ...props }) => {
  return (
    <Flex
      mx={[2, 3, 4]}
      width={[140, 160, 180]}
      minWidth={[140, 160, 180]}
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      {...props}
    >
      <Box height={90}>
        <Image src={icon} />
      </Box>
      <Text height={60} textAlign='center' color='secondary'>
        {text}
      </Text>
    </Flex>
  );
};

export const FeaturesHorizontal = (props) => {
  return (
    <Flex
      {...props}
      px={1}
      style={{ overflowY: 'auto' }}
      flexDirection={'row'}
      alignItems='center'
    >
      <Feature
        mx={undefined}
        mr={[2, 3, 4]}
        ml='auto'
        icon='/feature-domain.svg'
        text='Personal domain for your shop'
      />
      <Feature
        icon='/feature-unlimited.svg'
        text='Unlimited products and storage'
      />
      <Feature icon='/feature-creditcard.svg' text='Credit card payments' />
      <Feature
        icon='/feature-campaigns.svg'
        text='Flexible discount campaigns'
      />
      <Feature
        mx={undefined}
        ml={[2, 3, 4]}
        mr='auto'
        icon='/feature-analytics.svg'
        text='Usage and sales analytics'
      />
    </Flex>
  );
};
