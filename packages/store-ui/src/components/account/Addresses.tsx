import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTheme } from 'styled-components';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { Address } from '@sradevski/la-sdk/dist/models/address/address';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { AnalyticsEvents } from '@sradevski/analytics';
import { OldBlocksTheme } from '@sradevski/blocks-ui/dist/theme';
import {
  message,
  Spin,
  hooks,
  Flex,
  Button,
  Paragraph,
  Heading,
  Label,
} from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { getAddresses } from '../../state/modules/user/user.selector';
import { setAddresses } from '../../state/modules/user/user.module';
import { trackEvent } from '../../state/modules/analytics/analytics.actions';
import { useTranslation } from '../../common/i18n';
import { pickDiff } from '../../common/utils';
import { SelectableCard } from '../shared/SelectableCard';
import { CustomCard } from '../shared/components/CustomCard';
import { NoAddress } from '../shared/icons/NoAddress';
import { ShippingDescription } from '../shared/ShippingDescription';
import { AddressModal } from './AddressModal';

interface AddressesProps {
  user: User;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  onSelected?: (address: Address) => void;
  selectedAddress?: Address;
  theme: OldBlocksTheme;
}

export const Addresses = withTheme(
  ({
    user,
    showAddModal,
    setShowAddModal,
    onSelected,
    selectedAddress,
    theme,
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
        address => {
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

      caller(sdk.address.patch(patchedAddress._id, updatedFields), address => {
        message.success(t('address.updateAddressSuccess'));
        setShowAddModal(false);
        setAddressToEdit(undefined);
        return setAddresses([
          ...addresses.filter(address => address._id !== patchedAddress._id),
          address,
        ]);
      });
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
            {addresses?.length > 0 &&
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
                            kind='minimal'
                          >
                            <Label
                              color={
                                isChecked
                                  ? 'contentInversePrimary'
                                  : 'contentPrimary'
                              }
                            >
                              <EditOutlined />
                            </Label>
                          </Button>

                          <Button
                            onClick={e => {
                              e.stopPropagation();
                              handleRemoveAddress(address._id);
                            }}
                            kind='minimal'
                          >
                            <Label
                              color={
                                isChecked
                                  ? 'contentInversePrimary'
                                  : 'contentPrimary'
                              }
                            >
                              <DeleteOutlined />
                            </Label>
                          </Button>
                        </Flex>
                      }
                    />
                  </CardForAddress>
                );
              })}

            {addresses?.length === 0 && !showSpinner && (
              <Flex
                alignItems='center'
                justifyContent='center'
                flexDirection='column'
                p={3}
              >
                <NoAddress
                  primary={theme.colors.primary}
                  background={theme.colors.background.dark}
                />
                <Heading as='h2' color='contentPrimary' mt={3} size='large'>
                  {t('address.noAddress')}
                </Heading>
                <Paragraph size='small'>
                  {t('address.noAddressExplanation')}
                </Paragraph>
              </Flex>
            )}
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
  },
);
