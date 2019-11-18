import React from 'react';
import { Descriptions, DescriptionItem } from '@lamk/blocks-ui';
import { useTranslation } from '../../common/i18n';

export const ShippingDescription = ({ address }: any) => {
  const { t } = useTranslation();

  return (
    <Descriptions size='small' column={1}>
      <DescriptionItem label={t('common.name')}>
        {address.person}
      </DescriptionItem>
      <DescriptionItem label={t('common.address')}>
        {address.street}
      </DescriptionItem>
      <DescriptionItem label={t('common.city')}>{address.city}</DescriptionItem>
      <DescriptionItem label={t('common.country')}>
        {address.country}
      </DescriptionItem>
      <DescriptionItem label={t('common.phoneNumber')}>
        {address.phoneNumber}
      </DescriptionItem>
    </Descriptions>
  );
};
