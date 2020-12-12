import React, { useState } from 'react';
import { Heading, Button, Flex, hooks } from '@sradevski/blocks-ui';
import { useTranslation } from '../../common/i18n';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { Address } from '@sradevski/la-sdk/dist/models/address/address';
import { PlusOutlined } from '@ant-design/icons';
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
    undefined,
    t('address.addNewAddress'),
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
          leftIcon={<PlusOutlined />}
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
