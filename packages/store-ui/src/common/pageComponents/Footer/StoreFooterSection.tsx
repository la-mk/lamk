import React from 'react';
import { Flex, Text, Box, Title } from '@sradevski/blocks-ui';
import { PhoneFilled, MailFilled } from '@ant-design/icons';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { sdk } from '@sradevski/la-sdk';
import { useTranslation } from '../../i18n';
import { NewImage } from '../../../components/shared/NewImage';

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
      <Box maxHeight={96} maxWidth={192} mb={5} p={2} bg='background.light'>
        <NewImage
          imageId={store.logo}
          imageBucket={store._id}
          getFullPath={sdk.artifact.getUrlForImage}
          height={96}
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
