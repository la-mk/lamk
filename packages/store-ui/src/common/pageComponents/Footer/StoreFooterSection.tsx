import React from 'react';
import { Flex, Text, Box, Title, Image } from '@sradevski/blocks-ui';
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
    <Text my={1} color='text.light'>
      {icon}
      <Text fontSize={0} color='text.light' ml={4}>
        {value}
      </Text>
    </Text>
  );
};

export const StoreFooterSection = ({ store }: { store: Store }) => {
  const { t } = useTranslation();
  if (!store) {
    return null;
  }

  const { phoneNumber, alternatePhoneNumber, email } = store.contact || {};
  return (
    <Flex direction='column' align={'center'}>
      <Box height={84} mb={5} p={2} bg='background.light'>
        <Image
          getSrc={params =>
            sdk.artifact.getUrlForImage(store.logo, store._id, params)
          }
          height={84}
          alt='logo'
        />
      </Box>

      <Title mb={3} color='heading.light' level={4} fontSize={1}>
        {t('common.contactDetails').toUpperCase()}
      </Title>

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
