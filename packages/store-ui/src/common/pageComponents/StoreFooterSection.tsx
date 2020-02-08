import React from 'react';
import { Flex, Image, Text, Icon } from '@sradevski/blocks-ui';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { sdk } from '@sradevski/la-sdk';

export const StoreFooterSection = ({ store }: { store: Store }) => {
  const { phoneNumber, alternatePhoneNumber, email } = store.contact || {};
  return (
    <Flex
      flexDirection='column'
      alignItems={['center', 'flex-start', 'flex-start']}
    >
      <Image
        maxHeight='192px'
        maxWidth='192px'
        src={sdk.artifact.getUrlForArtifact(store.logo, store._id)}
        alt='logo'
      />

      {phoneNumber && (
        <Text type='secondary'>
          <Icon mr={2} type='phone' />
          {phoneNumber}
        </Text>
      )}
      {alternatePhoneNumber && (
        <Text type='secondary'>
          <Icon mr={2} type='phone' />
          {alternatePhoneNumber}
        </Text>
      )}
      {email && (
        <Text type='secondary'>
          <Icon mr={2} type='mail' />
          {email}
        </Text>
      )}
    </Flex>
  );
};
