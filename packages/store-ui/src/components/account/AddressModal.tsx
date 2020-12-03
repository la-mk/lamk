import React from 'react';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { Modal, Flex, Title, Text } from '@sradevski/blocks-ui';
import { useTranslation } from '../../common/i18n';
import { AddressForm } from './AddressForm';
import { Address } from '@sradevski/la-sdk/dist/models/address/address';

interface AddressesModalProps {
  user: User;
  address?: Address;
  visible: boolean;
  onClose: () => void;
  onAddAddress: (address: Address) => void;
  onPatchAddress: (address: Address) => void;
}
export const AddressModal = ({
  user,
  address,
  visible,
  onClose,
  onAddAddress,
  onPatchAddress,
}: AddressesModalProps) => {
  const { t } = useTranslation();
  if (!user) {
    return null;
  }

  return (
    <Modal maxWidth={['100%', '80%', '60%']} isOpen={visible} onClose={onClose}>
      <Flex
        pt={4}
        pb={5}
        align='center'
        justify='center'
        direction='column'
        width={'100%'}
        maxWidth={600}
        minWidth={200}
        mx='auto'
      >
        <Title level={2} mb={3} fontSize={4}>
          {t('common.address_plural')}
        </Title>
        <Text textAlign='center' fontSize={0}>
          {t('address.addAddressExplanation')}
        </Text>

        <AddressForm
          userId={user?._id}
          address={address}
          onAddAddress={onAddAddress}
          onPatchAddress={onPatchAddress}
          onCancel={onClose}
        />
      </Flex>
    </Modal>
  );
};
