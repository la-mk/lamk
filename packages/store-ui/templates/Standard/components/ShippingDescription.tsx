import React from 'react';
import { Flex, Text, Heading } from '@la-mk/blocks-ui';
import { User, MapPin, Phone } from 'react-feather';

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
    <Flex align='center' {...props}>
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
      <Flex mb={4} align='center' justify='space-between'>
        <Heading
          noOfLines={1}
          as='h4'
          size='sm'
          color={inverse ? 'heading.light' : 'heading.dark'}
        >
          {address.name}
        </Heading>
        {!!actions && actions}
      </Flex>

      <Flex direction='column'>
        <DescriptionEntry
          mb={3}
          title={<User size='1rem' />}
          item={address.person}
          inverse={inverse}
        />

        <DescriptionEntry
          mb={3}
          title={<MapPin size='1rem' />}
          item={`${address.street}, ${address.city}, ${address.country}`}
          inverse={inverse}
        />

        <DescriptionEntry
          title={<Phone size='1rem' />}
          item={address.phoneNumber}
          inverse={inverse}
        />
      </Flex>
    </>
  );
};
