import React from "react";
import { Flex, Text, Heading } from "@la-mk/blocks-ui";
import { User, MapPin, Phone } from "react-feather";

const DescriptionEntry = ({
  title,
  item,
  ...props
}: {
  title: React.ReactNode;
  item: string;
} & React.ComponentProps<typeof Flex>) => {
  return (
    <Flex align="center" {...props}>
      <Text color={"text.dark"}>{title}</Text>
      <Text ml={2} color={"mutedText.dark"}>
        {item}
      </Text>
    </Flex>
  );
};

export const ShippingDescription = ({ address, actions }: any) => {
  return (
    <>
      <Flex mb={4} align="center" justify="space-between">
        <Heading noOfLines={1} as="h4" size="sm">
          {address.name}
        </Heading>
        {!!actions && actions}
      </Flex>

      <Flex direction="column">
        <DescriptionEntry
          mb={3}
          title={<User size="1rem" />}
          item={address.person}
        />

        <DescriptionEntry
          mb={3}
          title={<MapPin size="1rem" />}
          item={`${address.street}, ${address.city}, ${address.country}`}
        />

        <DescriptionEntry
          title={<Phone size="1rem" />}
          item={address.phoneNumber}
        />
      </Flex>
    </>
  );
};
