import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { Order } from '@la-mk/la-sdk/dist/models/order';

export const BuyerInformation = ({
  buyer,
  translations,
}: {
  buyer: Order['deliverTo'];
  translations: { buyer: string };
}) => {
  return (
    <View>
      <Text style={{ fontWeight: 'bold' }}>{translations.buyer}</Text>

      <Text style={{ marginTop: 10 }}>{buyer?.person}</Text>
      <Text>
        {buyer?.street}, {buyer?.region ?? ''}
        {buyer?.zip}
      </Text>
      <Text>
        {buyer?.city}, {buyer?.country}
      </Text>
    </View>
  );
};
