import React, { useEffect, useState } from 'react';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { Row, Col, message, Spin, hooks } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { AddAddressCard } from './AddAddressCard';
import { Address } from '@sradevski/la-sdk/dist/models/address/address';
import { pickDiff } from '../../common/utils';
import { useSelector, useDispatch } from 'react-redux';
import { getAddresses } from '../../state/modules/user/user.selector';
import { setAddresses } from '../../state/modules/user/user.module';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { useTranslation } from '../../common/i18n';
import { trackEvent } from '../../state/modules/analytics/analytics.actions';
import { AnalyticsEvents } from '../../common/analytics';

interface AddressesProps {
  user: User;
}

export const Addresses = ({ user }: AddressesProps) => {
  const [shouldResetAddressForm, setShouldResetAddressForm] = useState(false);
  const [caller, showSpinner] = hooks.useCall();
  const addresses = useSelector(getAddresses);
  const dispatch = useDispatch();
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
        message.success(t('address.createAddressSuccess'));
        setShouldResetAddressForm(x => !x);

        dispatch(
          trackEvent({
            eventName: AnalyticsEvents.addAddress,
            numberOfAddresses: addresses.length + 1,
          }),
        );

        return setAddresses([...addresses, address]);
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
        message.success(t('address.updateAddressSuccess'));
        return setAddresses([
          ...addresses.filter(address => address._id !== patchedAddress._id),
          address,
        ]);
      },
    );
  };

  const handleRemoveAddress = (addressId: string) => {
    caller(sdk.address.remove(addressId), () => {
      message.success(t('address.removeAddressSuccess'));
      return setAddresses(
        addresses.filter(address => address._id !== addressId),
      );
    });
  };

  return (
    <Spin spinning={showSpinner}>
      <Row
        align='top'
        justify='center'
        gutter={{ xs: 16, sm: 24, md: 32, lg: 64 }}
      >
        {addresses &&
          addresses.map(address => {
            return (
              <Col key={address._id} mb={4}>
                <AddAddressCard
                  userId={user._id}
                  address={address}
                  resetAddressForm={false}
                  onAddAddress={handleAddAddress}
                  onPatchAddress={handlePatchAddress}
                  onRemoveAddress={handleRemoveAddress}
                />
              </Col>
            );
          })}

        <Col mb={4}>
          <AddAddressCard
            userId={user._id}
            address={undefined}
            resetAddressForm={shouldResetAddressForm}
            onAddAddress={handleAddAddress}
            onPatchAddress={handlePatchAddress}
            onRemoveAddress={handleRemoveAddress}
          />
        </Col>
      </Row>
    </Spin>
  );
};
