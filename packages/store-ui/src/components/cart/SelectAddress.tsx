import React, { useState } from 'react';
import { Title, Button, Flex } from '@sradevski/blocks-ui';
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
      <Flex mt={6} align='center' justify='space-between'>
        <Title level={3} fontSize={3} color='text.dark'>
          {t('address.chooseShippingAddress')}
        </Title>
        <Button
          variant='link'
          onClick={() => setAddressModalVisible(true)}
          leftIcon={<PlusOutlined />}
        >
          {t('address.addNewAddress')}
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
