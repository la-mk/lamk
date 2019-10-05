import React from 'react';
import { User } from '@lamk/la-sdk/dist/models/user';
import { Modal } from '@lamk/blocks-ui';
import { Addresses } from './Addresses';

interface AddressesModalProps {
  user: User;
  visible: boolean;
  onClose: () => void;
}
export const AddressesModal = ({
  user,
  visible,
  onClose,
}: AddressesModalProps) => {
  return (
    <Modal
      width={'80%'}
      centered
      destroyOnClose
      visible={visible}
      footer={null}
      onCancel={onClose}
      title={'Addresses'}
    >
      <Addresses user={user} />
    </Modal>
  );
};
