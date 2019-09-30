import React, { useEffect, useState } from 'react';
import { User } from 'la-sdk/dist/models/user';
import { Row, Col, message, Spin } from 'blocks-ui';
import { sdk } from 'la-sdk';
import { AddAddressCard } from './AddAddressCard';
import { Address } from 'la-sdk/dist/models/address';
import { pickDiff } from '../../common/utils';

interface AddressesProps {
  user: User;
}

export const Addresses = ({ user }: AddressesProps) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  useEffect(() => {
    if (!user) {
      return;
    }

    setShowSpinner(true);
    sdk.address
      .findForUser(user._id)
      .then(addresses => {
        setAddresses(addresses.data);
      })
      .catch(err => message.error(err))
      .finally(() => setShowSpinner(false));
  }, [user]);

  if (!user) {
    return null;
  }

  const handleAddAddress = (address: Address) => {
    setShowSpinner(true);

    sdk.address
      .create({ addressFor: user._id, ...address })
      .then(address => {
        setAddresses([...addresses, address]);
        message.success(`Address successfully created`);
      })
      .catch(err => message.error(err.message))
      .finally(() => setShowSpinner(false));
  };

  const handlePatchAddress = (patchedAddress: Address) => {
    setShowSpinner(true);
    const originalAddress = addresses.find(
      address => address._id === patchedAddress._id,
    );

    if (!originalAddress) {
      return;
    }

    const updatedFields = pickDiff(originalAddress, patchedAddress);

    sdk.address
      .patch(patchedAddress._id, updatedFields)
      .then(address => {
        setAddresses([
          ...addresses.filter(address => address._id !== patchedAddress._id),
          address,
        ]);
        message.success(`Address successfully updated`);
      })
      .catch(err => message.error(err.message))
      .finally(() => setShowSpinner(false));
  };
  const handleRemoveAddress = (addressId: string) => {
    setShowSpinner(true);

    sdk.address
      .remove(addressId)
      .then(address => {
        setAddresses(addresses.filter(address => address._id !== addressId));
        message.success(`Address successfully removed`);
      })
      .catch(err => message.error(err.message))
      .finally(() => setShowSpinner(false));
  };

  return (
    <Spin spinning={showSpinner}>
      <Row
        type='flex'
        align='top'
        justify='center'
        gutter={{ xs: 16, sm: 24, md: 32, lg: 64 }}
      >
        {addresses.map(address => {
          return (
            <Col key={address._id} mb={4}>
              <AddAddressCard
                address={address}
                onAddAddress={handleAddAddress}
                onPatchAddress={handlePatchAddress}
                onRemoveAddress={handleRemoveAddress}
              />
            </Col>
          );
        })}

        <Col mb={4}>
          <AddAddressCard
            address={undefined}
            onAddAddress={handleAddAddress}
            onPatchAddress={handlePatchAddress}
            onRemoveAddress={handleRemoveAddress}
          />
        </Col>
      </Row>
    </Spin>
  );
};
