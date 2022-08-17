import React from "react";
import { Phone, Mail } from "react-feather";
import { Flex, Text } from "@la-mk/blocks-ui";
import { Contact as ContactType } from "../../../../domain/contact";

export const Contact = ({
  contact,
  darkMode,
  hideAlternate,
}: {
  contact: ContactType | undefined;
  darkMode?: boolean;
  hideAlternate?: boolean;
}) => {
  const { phoneNumber, alternatePhoneNumber, email } = contact || {};

  return (
    <>
      {phoneNumber && (
        <Text as="strong" mt={1} size="xl" color={"text.light"}>
          {phoneNumber}
        </Text>
      )}
      {!hideAlternate && alternatePhoneNumber && (
        <Text as="strong" mt={1} size="xl" color={"text.light"}>
          {alternatePhoneNumber}
        </Text>
      )}
      {email && (
        <Text as="strong" mt={1} size="xl" color={"text.light"}>
          {email}
        </Text>
      )}
    </>
  );
};
