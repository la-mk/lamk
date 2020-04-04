import React, { useState } from 'react';
import { Title, Row, Button, Col } from '@sradevski/blocks-ui';
import { useTranslation } from '../../common/i18n';
import { ShippingDescription } from '../shared/ShippingDescription';
import { AddressesModal } from '../account/AddressesModal';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { Address } from '@sradevski/la-sdk/dist/models/address/address';
import { SelectableCard } from '../shared/SelectableCard';

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
      <Title level={3}>{t('address.chooseShippingAddress')}</Title>
      <Row
        mt={3}
        align='top'
        justify='start'
        gutter={{ xs: 16, sm: 24, md: 32, lg: 64 }}
      >
        {addresses &&
          addresses.map(address => {
            return (
              <Col key={address._id} mb={4}>
                <SelectableCard
                  isChecked={deliverTo && deliverTo._id === address._id}
                  hoverable={true}
                  onClick={() => setDeliverTo(address)}
                  width={320}
                  title={address.name}
                >
                  <ShippingDescription address={address} />
                </SelectableCard>
              </Col>
            );
          })}
        <Col key={'new'} mb={4}>
          <Button size='large' onClick={() => setAddressModalVisible(true)}>
            {t('address.addNewAddress')}
          </Button>
        </Col>
      </Row>
      <AddressesModal
        user={user}
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
      />
    </>
  );
};
