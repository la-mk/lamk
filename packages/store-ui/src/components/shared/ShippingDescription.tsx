import React from 'react';
import { Descriptions, DescriptionItem } from '@lamk/blocks-ui';

export const ShippingDescription = ({ address }: any) => {
  return (
    <Descriptions size='small' column={1}>
      <DescriptionItem label='Name'>{address.person}</DescriptionItem>
      <DescriptionItem label='Address'>{address.street}</DescriptionItem>
      <DescriptionItem label='City'>{address.city}</DescriptionItem>
      <DescriptionItem label='Country'>{address.country}</DescriptionItem>
      <DescriptionItem label='Phone Number'>
        {address.phoneNumber}
      </DescriptionItem>
    </Descriptions>
  );
};
