import React, { useEffect, useState } from 'react';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { message, Spin, hooks, Flex, Button, Text } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { Address } from '@sradevski/la-sdk/dist/models/address/address';
import { pickDiff } from '../../common/utils';
import { useSelector, useDispatch } from 'react-redux';
import { getAddresses } from '../../state/modules/user/user.selector';
import { setAddresses } from '../../state/modules/user/user.module';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { useTranslation } from '../../common/i18n';
import { trackEvent } from '../../state/modules/analytics/analytics.actions';
import { AnalyticsEvents } from '@sradevski/analytics';
import { SelectableCard } from '../shared/SelectableCard';
import { CustomCard } from '../shared/components/CustomCard';
import { ShippingDescription } from '../shared/ShippingDescription';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AddressModal } from './AddressModal';

interface AddressesProps {
  user: User;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  onSelected?: (address: Address) => void;
  selectedAddress?: Address;
}

export const Addresses = ({
  user,
  showAddModal,
  setShowAddModal,
  onSelected,
  selectedAddress,
}: AddressesProps) => {
  const [caller, showSpinner] = hooks.useCall();
  const [addressToEdit, setAddressToEdit] = useState<Address | undefined>();
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
        setShowAddModal(false);

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
        setShowAddModal(false);
        setAddressToEdit(undefined);
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

  const CardForAddress = onSelected ? SelectableCard : CustomCard;

  return (
    <>
      <Spin spinning={showSpinner}>
        <Flex flexDirection='column'>
          {addresses &&
            addresses.map(address => {
              const isChecked =
                selectedAddress && selectedAddress._id === address._id;
              return (
                <CardForAddress
                  key={address._id}
                  isChecked={isChecked}
                  onClick={onSelected ? () => onSelected(address) : undefined}
                  width='100%'
                  mb={3}
                >
                  <ShippingDescription
                    inverse={isChecked}
                    address={address}
                    actions={
                      <Flex>
                        <Button
                          onClick={e => {
                            e.stopPropagation();
                            setAddressToEdit(address);
                            setShowAddModal(true);
                          }}
                          type='link'
                        >
                          <Text
                            fontSize={2}
                            color={isChecked ? 'heading.light' : 'heading.dark'}
                          >
                            <EditOutlined />
                          </Text>
                        </Button>

                        <Button
                          onClick={e => {
                            e.stopPropagation();
                            handleRemoveAddress(address._id);
                          }}
                          type='link'
                        >
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
                </CardForAddress>
              );
            })}
        </Flex>
      </Spin>

      <AddressModal
        user={user}
        address={addressToEdit}
        visible={showAddModal}
        onAddAddress={handleAddAddress}
        onPatchAddress={handlePatchAddress}
        onClose={() => {
          setShowAddModal(false);
          setAddressToEdit(undefined);
        }}
      />
    </>
  );
};
