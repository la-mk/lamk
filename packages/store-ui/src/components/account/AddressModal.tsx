import React from 'react';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { Modal } from '@sradevski/blocks-ui';
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
    <Modal
      width={'80%'}
      centered
      destroyOnClose
      visible={visible}
      footer={null}
      onCancel={onClose}
      title={t('common.address_plural')}
    >
      <AddressForm
        userId={user?._id}
        address={address}
        onAddAddress={onAddAddress}
        onPatchAddress={onPatchAddress}
      />
    </Modal>
  );
};
