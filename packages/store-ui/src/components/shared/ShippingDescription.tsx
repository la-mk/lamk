import React from 'react';
import { Flex, Text, Title } from '@sradevski/blocks-ui';
import {
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from '@ant-design/icons';

const DescriptionEntry = ({
  title,
  item,
  inverse,
  ...props
}: {
  title: React.ReactNode;
  item: string;
  inverse?: boolean;
} & React.ComponentProps<typeof Flex>) => {
  return (
    <Flex alignItems='center' {...props}>
      <Text color={inverse ? 'text.light' : 'text.dark'}>{title}</Text>
      <Text ml={2} color={inverse ? 'mutedText.light' : 'mutedText.dark'}>
        {item}
      </Text>
    </Flex>
  );
};

export const ShippingDescription = ({ address, inverse, actions }: any) => {
  return (
    <>
      <Flex mb={3} alignItems='center' justifyContent='space-between'>
        <Title
          ellipsis={true}
          m={0}
          level={4}
          fontSize={2}
          color={inverse ? 'heading.light' : 'heading.dark'}
        >
          {address.name}
        </Title>
        {!!actions && actions}
      </Flex>

      <Flex flexDirection='column'>
        <DescriptionEntry
          mb={3}
          title={<UserOutlined />}
          item={address.person}
          inverse={inverse}
        />

        <DescriptionEntry
          mb={3}
          title={<EnvironmentOutlined />}
          item={`${address.street}, ${address.city}, ${address.country}`}
          inverse={inverse}
        />

        <DescriptionEntry
          title={<PhoneOutlined />}
          item={address.phoneNumber}
          inverse={inverse}
        />
      </Flex>
    </>
  );
};
