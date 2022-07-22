import React from "react";
import { Phone, Mail } from "react-feather";
import { Flex, Text } from "@la-mk/blocks-ui";
import { Contact as ContactType } from "../../../../domain/contact";

const ContactEntry = ({
  icon,
  value,
  darkMode,
}: {
  icon: React.ReactNode;
  value?: string | number;
  darkMode?: boolean;
}) => {
  if (!value) {
    return null;
  }

  return (
    <Flex my={1} align="center">
      <Text color={darkMode ? "mutedText.light" : "mutedText.dark"}>
        {icon}
      </Text>

      <Text
        size="sm"
        color={darkMode ? "mutedText.light" : "mutedText.dark"}
        ml={4}
      >
        {value}
      </Text>
    </Flex>
  );
};

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
        <ContactEntry
          darkMode={darkMode}
          icon={<Phone size="1rem" />}
          value={phoneNumber}
        />
      )}
      {!hideAlternate && alternatePhoneNumber && (
        <ContactEntry
          darkMode={darkMode}
          icon={<Phone size="1rem" />}
          value={alternatePhoneNumber}
        />
      )}
      {email && (
        <ContactEntry
          darkMode={darkMode}
          icon={<Mail size="1rem" />}
          value={email}
        />
      )}
    </>
  );
};
