import React from 'react';
import { Flex, Text, Box, Heading, Image } from '@sradevski/blocks-ui';

import { Store } from '@sradevski/la-sdk/dist/models/store';
import { sdk } from '@sradevski/la-sdk';
import { useTranslation } from '../../i18n';
import { Contact } from '../../../components/shared/Contact';

export const StoreFooterSection = ({ store }: { store: Store }) => {
  const { t } = useTranslation();
  if (!store) {
    return null;
  }

  return (
    <Flex direction='column' align={'center'}>
      <Box height={'6rem'} mb={5} bg='background.light'>
        <Image
          getSrc={params =>
            sdk.artifact.getUrlForImage(store.logo, store._id, params)
          }
          height={84}
          alt='logo'
        />
      </Box>

      <Heading mb={3} color='heading.light' as='h4' size={'xs'}>
        {t('common.contactDetails').toUpperCase()}
      </Heading>

      <Contact darkMode contact={store.contact} />
    </Flex>
  );
};
