import React from 'react';
import { Flex, Image, Text, Box, Title } from '@sradevski/blocks-ui';
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
    <Text my={1} color='primary'>
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
    <Flex flexDirection='column' alignItems={'flex-start'}>
      <Box mb={5} p={2} bg='background.light'>
        <Image
          maxHeight='96px'
          maxWidth='192px'
          src={sdk.artifact.getUrlForArtifact(store.logo, store._id)}
          alt='logo'
        />
      </Box>

      <Title mb={3} color='heading.light' level={4} fontSize={1}>
        {t('common.contactDetails').toUpperCase()}
      </Title>

      <ContactEntry icon={<PhoneFilled />} value={phoneNumber} />
      <ContactEntry icon={<PhoneFilled />} value={alternatePhoneNumber} />
      <ContactEntry icon={<MailFilled />} value={email} />
    </Flex>
  );
};
