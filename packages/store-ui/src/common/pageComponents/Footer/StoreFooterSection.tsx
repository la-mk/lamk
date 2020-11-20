import React from 'react';
import { Flex, Paragraph, Box, Heading, Image } from '@sradevski/blocks-ui';
import { PhoneFilled, MailFilled } from '@ant-design/icons';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { sdk } from '@sradevski/la-sdk';
import { useTranslation } from '../../i18n';

const ContactEntry = ({
  icon,
  value,
}: {
  icon: any;
  value?: string | number;
}) => {
  if (!value) {
    return null;
  }

  return (
    <Paragraph as='span' my={1} color='contentInverseSecondary'>
      {icon}
      <Paragraph as='span' color='contentInverseSecondary' ml={4}>
        {value}
      </Paragraph>
    </Paragraph>
  );
};

export const StoreFooterSection = ({ store }: { store: Store }) => {
  const { t } = useTranslation();
  if (!store) {
    return null;
  }

  const { phoneNumber, alternatePhoneNumber, email } = store.contact || {};
  return (
    <Flex flexDirection='column' alignItems={'center'}>
      <Box height={84} mb={5} p={2} bg='background.light'>
        <Image
          getSrc={params =>
            sdk.artifact.getUrlForImage(store.logo, store._id, params)
          }
          height={84}
          alt='logo'
        />
      </Box>

      <Heading mb={3} color='contentInversePrimary' as='h4' size='xsmall'>
        {t('common.contactDetails').toUpperCase()}
      </Heading>

      {phoneNumber && (
        <ContactEntry icon={<PhoneFilled />} value={phoneNumber} />
      )}
      {alternatePhoneNumber && (
        <ContactEntry icon={<PhoneFilled />} value={alternatePhoneNumber} />
      )}
      {email && <ContactEntry icon={<MailFilled />} value={email} />}
    </Flex>
  );
};
