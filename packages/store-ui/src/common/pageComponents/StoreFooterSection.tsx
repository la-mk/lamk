import React from 'react';
import { Flex, Image, Text } from '@sradevski/blocks-ui';
import { PhoneOutlined, MailOutlined } from '@ant-design/icons';
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
          <PhoneOutlined />
          <Text ml={2}>{phoneNumber}</Text>
        </Text>
      )}
      {alternatePhoneNumber && (
        <Text type='secondary'>
          <PhoneOutlined />
          <Text ml={2}>{alternatePhoneNumber}</Text>
        </Text>
      )}
      {email && (
        <Text type='secondary'>
          <MailOutlined />
          <Text ml={2}>{email}</Text>
        </Text>
      )}
    </Flex>
  );
};
