import React from 'react';
import { Flex, Paragraph, Heading, Label } from '@sradevski/blocks-ui';
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
    <Flex mb={3} alignItems='center' {...props}>
      <Label
        size='small'
        color={inverse ? 'contentInversePrimary' : 'contentPrimary'}
      >
        {title}
      </Label>
      <Label
        size='small'
        ml={2}
        color={inverse ? 'contentInverseSecondary' : 'contentSecondary'}
      >
        {item}
      </Label>
    </Flex>
  );
};

export const ShippingDescription = ({ address, inverse, actions }: any) => {
  return (
    <>
      <Flex mb={3} alignItems='center' justifyContent='space-between'>
        <Heading
          // ellipsis={true}
          m={0}
          as='h4'
          size='xsmall'
          color={inverse ? 'contentInversePrimary' : 'contentPrimary'}
        >
          {address.name}
        </Heading>
        {!!actions && actions}
      </Flex>

      <Flex flexDirection='column'>
        <DescriptionEntry
          title={<UserOutlined />}
          item={address.person}
          inverse={inverse}
        />

        <DescriptionEntry
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
