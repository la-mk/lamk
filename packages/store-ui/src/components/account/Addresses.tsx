import React, { useEffect, useState } from 'react';
import { User } from '@lamk/la-sdk/dist/models/user';
import { Row, Col, message, Spin } from '@lamk/blocks-ui';
import { sdk } from '@lamk/la-sdk';
import { AddAddressCard } from './AddAddressCard';
import { Address } from '@lamk/la-sdk/dist/models/address';
import { pickDiff } from '../../common/utils';
import { useSelector, useDispatch } from 'react-redux';
import { getAddresses } from '../../state/modules/user/user.selector';
import { setAddresses } from '../../state/modules/user/user.module';
import { useCall } from '../shared/hooks/useCall';
import { FindResult } from '@lamk/la-sdk/dist/setup';

interface AddressesProps {
  user: User;
}

export const Addresses = ({ user }: AddressesProps) => {
  const [caller, showSpinner] = useCall();
  const addresses = useSelector(getAddresses);

  useEffect(() => {
    if (!user) {
      return;
    }
    caller(
      sdk.address.findForUser(user._id),
      (addresses: FindResult<Address>) => setAddresses(addresses.data),
    );
  }, [user]);

  const handleAddAddress = (address: Address) => {
    caller(
      sdk.address.create({ addressFor: user._id, ...address }),
      (address: Address) => {
        setAddresses([...addresses, address]);
        message.success(`Address successfully created`);
      },
    );
  };

  const handlePatchAddress = (patchedAddress: Address) => {
    const originalAddress = addresses.find(
      address => address._id === patchedAddress._id,
    );

    if (!originalAddress) {
      return;
    }

    const updatedFields = pickDiff(originalAddress, patchedAddress);

    caller(
      sdk.address.patch(patchedAddress._id, updatedFields),
      (address: Address) => {
        setAddresses([
          ...addresses.filter(address => address._id !== patchedAddress._id),
          address,
        ]);
        message.success(`Address successfully updated`);
      },
    );
  };

  const handleRemoveAddress = (addressId: string) => {
    caller(sdk.address.remove(addressId), () => {
      setAddresses(addresses.filter(address => address._id !== addressId));
      message.success(`Address successfully removed`);
    });
  };

  return (
    <Spin spinning={showSpinner}>
      <Row
        type='flex'
        align='top'
        justify='center'
        gutter={{ xs: 16, sm: 24, md: 32, lg: 64 }}
      >
        {addresses &&
          addresses.map(address => {
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
