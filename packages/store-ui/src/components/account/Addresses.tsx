import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTheme } from 'styled-components';
import { Edit3, Trash2 } from 'react-feather';
import { User } from '@la-mk/la-sdk/dist/models/user';
import { Address } from '@la-mk/la-sdk/dist/models/address/address';
import { FindResult } from '@la-mk/la-sdk/dist/setup';
import { AnalyticsEvents } from '@la-mk/analytics';
import { BlocksTheme } from '@la-mk/blocks-ui/dist/theme';
import {
  toast,
  Spinner,
  hooks,
  Flex,
  Button,
  Grid,
  Result,
} from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';
import { getAddresses } from '../../state/modules/user/user.selector';
import { setAddresses } from '../../state/modules/user/user.module';
import { trackEvent } from '../../state/modules/analytics/analytics.module';
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
  theme: BlocksTheme;
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
          toast.success(t('address.createAddressSuccess'));
          setShowAddModal(false);

          dispatch(
            trackEvent({
              eventName: AnalyticsEvents.addAddress,
              numberOfAddresses: addresses.length + 1,
            }),
          );

          return setAddresses([address, ...addresses]);
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
        toast.success(t('address.updateAddressSuccess'));
        setShowAddModal(false);
        setAddressToEdit(undefined);
        return setAddresses(
          addresses.map(addr => (addr._id === address._id ? address : addr)),
        );
      });
    };

    const handleRemoveAddress = (addressId: string) => {
      caller(sdk.address.remove(addressId), () => {
        toast.success(t('address.removeAddressSuccess'));
        return setAddresses(
          addresses.filter(address => address._id !== addressId),
        );
      });
    };

    const CardForAddress = onSelected ? SelectableCard : CustomCard;

    return (
      <>
        <Spinner isLoaded={!showSpinner}>
          <Grid spacing={6}>
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
                  >
                    <ShippingDescription
                      inverse={isChecked}
                      address={address}
                      actions={
                        <Flex>
                          <Button
                            mr={1}
                            onClick={e => {
                              e.stopPropagation();
                              setAddressToEdit(address);
                              setShowAddModal(true);
                            }}
                            // @ts-ignore
                            color={isChecked ? 'heading.light' : 'heading.dark'}
                            variant='ghost'
                            leftIcon={<Edit3 size='1.2rem' />}
                          />

                          <Button
                            ml={1}
                            onClick={e => {
                              e.stopPropagation();
                              handleRemoveAddress(address._id);
                            }}
                            variant='ghost'
                            // @ts-ignore
                            color={isChecked ? 'heading.light' : 'heading.dark'}
                            leftIcon={<Trash2 size='1.2rem' />}
                          />
                        </Flex>
                      }
                    />
                  </CardForAddress>
                );
              })}

            {addresses?.length === 0 && !showSpinner && (
              <Flex align='center' justify='center' direction='column' p={3}>
                <Result
                  status='empty'
                  icon={
                    <NoAddress
                      primary={theme.colors.primary['500']}
                      background={theme.colors.background.dark}
                    />
                  }
                  title={t('address.noAddress')}
                  description={t('address.noAddressExplanation')}
                />
              </Flex>
            )}
          </Grid>
        </Spinner>

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
