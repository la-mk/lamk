import React, { useState } from 'react';
import { Title, Row, Button, Col, Flex, Text } from '@sradevski/blocks-ui';
import { useTranslation } from '../../common/i18n';
import { ShippingDescription } from '../shared/ShippingDescription';
import { AddressesModal } from '../account/AddressesModal';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { Address } from '@sradevski/la-sdk/dist/models/address/address';
import { SelectableCard } from '../shared/SelectableCard';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface SelectAddressProps {
  user: User;
  addresses: Address[];
  deliverTo: Address;
  setDeliverTo: (address: Address) => void;
}

export const SelectAddress = ({
  user,
  addresses,
  deliverTo,
  setDeliverTo,
}: SelectAddressProps) => {
  const { t } = useTranslation();
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  return (
    <>
      <Flex alignItems='center' justifyContent='space-between'>
        <Title level={3} fontSize={3} color='text.dark'>
          {t('address.chooseShippingAddress')}
        </Title>
        <Button
          type='link'
          onClick={() => setAddressModalVisible(true)}
          icon={<PlusOutlined />}
        >
          {t('address.addNewAddress')}
        </Button>
      </Flex>

      <Flex mt={3} flexDirection='column'>
        {addresses &&
          addresses.map(address => {
            const isChecked = deliverTo && deliverTo._id === address._id;
            return (
              <SelectableCard
                key={address._id}
                isChecked={isChecked}
                onClick={() => setDeliverTo(address)}
                width='100%'
                mb={3}
              >
                <ShippingDescription
                  inverse={isChecked}
                  address={address}
                  actions={
                    <Flex>
                      <Button type='link'>
                        <Text
                          fontSize={2}
                          color={isChecked ? 'heading.light' : 'heading.dark'}
                        >
                          <EditOutlined />
                        </Text>
                      </Button>

                      <Button type='link'>
                        <Text
                          fontSize={2}
                          color={isChecked ? 'heading.light' : 'heading.dark'}
                        >
                          <DeleteOutlined />
                        </Text>
                      </Button>
                    </Flex>
                  }
                />
              </SelectableCard>
            );
          })}
      </Flex>
      <AddressesModal
        user={user}
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
      />
    </>
  );
};
