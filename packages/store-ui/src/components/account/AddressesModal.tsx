import React from 'react';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { Modal } from '@sradevski/blocks-ui';
import { Addresses } from './Addresses';
import { useTranslation } from '../../common/i18n';

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
  const { t } = useTranslation();

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
      <Addresses user={user} />
    </Modal>
  );
};
