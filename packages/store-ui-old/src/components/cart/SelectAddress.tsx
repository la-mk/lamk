import React, { useState } from 'react';
import { Heading, Button, Flex, hooks } from '@la-mk/blocks-ui';
import { useTranslation } from '../../common/i18n';
import { User } from '@la-mk/la-sdk/dist/models/user';
import { Address } from '@la-mk/la-sdk/dist/models/address/address';
import { Plus } from 'react-feather';
import { Addresses } from '../account/Addresses';

interface SelectAddressProps {
  user: User;
  deliverTo: Address;
  setDeliverTo: (address: Address) => void;
}

export const SelectAddress = ({
  user,
  deliverTo,
  setDeliverTo,
}: SelectAddressProps) => {
  const { t } = useTranslation();
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const addAddressText = hooks.useBreakpoint([
    t('actions.add'),
    t('actions.add'),
    t('address.addNewAddress'),
  ]);

  return (
    <>
      <Flex mb={4} mt={7} align='center' justify='space-between'>
        <Heading as='h3' size='md' noOfLines={1} mr={3}>
          {t('address.chooseShippingAddress')}
        </Heading>
        <Button
          variant='link'
          onClick={() => setAddressModalVisible(true)}
          leftIcon={<Plus size='1.2rem' />}
        >
          {addAddressText}
        </Button>
      </Flex>

      <Flex mt={3} direction='column'>
        <Addresses
          user={user}
          showAddModal={addressModalVisible}
          setShowAddModal={setAddressModalVisible}
          selectedAddress={deliverTo}
          onSelected={setDeliverTo}
        />
      </Flex>
    </>
  );
};
