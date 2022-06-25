import React, { useState } from 'react';
import { Button, Flex } from '@la-mk/blocks-ui';
import { Addresses } from './Addresses';
import { useTranslation } from '../../common/i18n';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';
import { User } from '@la-mk/la-sdk/dist/models/user';
import { Page } from '../shared/Page';
import { BackButton } from './BackButton';

export const MyAddresses = ({ user }: { user: User }) => {
  const { t } = useTranslation();
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/account/addresses', title: t('pages.myAddresses') },
  ]);

  return (
    <Page maxWidth={'86rem'}>
      <BackButton />
      <Flex mb={6} align='center' justify='center'>
        <Button onClick={() => setShowAddAddressModal(true)}>
          {t('address.addNewAddress')}
        </Button>
      </Flex>
      <Addresses
        user={user}
        showAddModal={showAddAddressModal}
        setShowAddModal={setShowAddAddressModal}
      />
    </Page>
  );
};
