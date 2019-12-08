import React, { useEffect, useState } from 'react';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { Row, Col, message, Spin } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { AddAddressCard } from './AddAddressCard';
import { Address } from '@sradevski/la-sdk/dist/models/address';
import { pickDiff } from '../../common/utils';
import { useSelector, useDispatch } from 'react-redux';
import { getAddresses } from '../../state/modules/user/user.selector';
import { setAddresses } from '../../state/modules/user/user.module';
import { useCall } from '../shared/hooks/useCall';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { useTranslation } from '../../common/i18n';

interface AddressesProps {
  user: User;
}

export const Addresses = ({ user }: AddressesProps) => {
  const [caller, showSpinner] = useCall();
  const addresses = useSelector(getAddresses);
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      return;
    }
    caller(
      sdk.address.findForUser(user._id),
      (addresses: FindResult<Address>) => setAddresses(addresses.data),
    );
  }, [caller, user]);

  const handleAddAddress = (address: Address) => {
    caller(
      sdk.address.create({ addressFor: user._id, ...address }),
      (address: Address) => {
        setAddresses([...addresses, address]);
        message.success(t('address.createAddressSuccess'));
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
        message.success(t('address.updateAddressSuccess'));
      },
    );
  };

  const handleRemoveAddress = (addressId: string) => {
    caller(sdk.address.remove(addressId), () => {
      setAddresses(addresses.filter(address => address._id !== addressId));
      message.success(t('address.removeAddressSuccess'));
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
