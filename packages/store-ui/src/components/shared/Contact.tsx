import React from 'react';
import { PhoneFilled, MailFilled } from '@ant-design/icons';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { Text } from '@la-mk/blocks-ui';

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
    <Text my={1} color={darkMode ? 'mutedText.light' : 'mutedText.dark'}>
      {icon}
      <Text
        size='sm'
        color={darkMode ? 'mutedText.light' : 'mutedText.dark'}
        ml={4}
      >
        {value}
      </Text>
    </Text>
  );
};

export const Contact = ({
  contact,
  darkMode,
  hideAlternate,
}: {
  contact: Store['contact'];
  darkMode?: boolean;
  hideAlternate?: boolean;
}) => {
  const { phoneNumber, alternatePhoneNumber, email } = contact || {};

  return (
    <>
      {phoneNumber && (
        <ContactEntry
          darkMode={darkMode}
          icon={<PhoneFilled />}
          value={phoneNumber}
        />
      )}
      {!hideAlternate && alternatePhoneNumber && (
        <ContactEntry
          darkMode={darkMode}
          icon={<PhoneFilled />}
          value={alternatePhoneNumber}
        />
      )}
      {email && (
        <ContactEntry darkMode={darkMode} icon={<MailFilled />} value={email} />
      )}
    </>
  );
};
