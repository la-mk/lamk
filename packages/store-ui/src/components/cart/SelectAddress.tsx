import React, { useState } from 'react';
import { Heading, Button, Flex } from '@sradevski/blocks-ui';
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

  return (
    <>
      <Flex alignItems='center' justifyContent='space-between'>
        <Heading
          as='h3'
          size={['xsmall', 'small', 'small']}
          color='contentSecondary'
        >
          {t('address.chooseShippingAddress')}
        </Heading>
        <Button
          kind='minimal'
          size='compact'
          onClick={() => setAddressModalVisible(true)}
          startEnhancer={() => <PlusOutlined />}
        >
          {t('address.addNewAddress')}
        </Button>
      </Flex>

      <Flex mt={3} flexDirection='column'>
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
