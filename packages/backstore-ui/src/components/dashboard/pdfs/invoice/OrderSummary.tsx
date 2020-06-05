import React from 'react';
import { View, Text } from '@react-pdf/renderer';

export interface PricesSummary {
  productsTotal: number;
  withCampaignsTotal: number;
  total: number;
}

export const OrderSummary = ({
  pricesSummary,
  translations,
}: {
  pricesSummary: PricesSummary;
  translations: {
    delivery: string;
    total: string;
    totalWithTax: string;
    discount: string;
  };
}) => {
  const { productsTotal, withCampaignsTotal, total } = pricesSummary;

  return (
    <View style={{ textAlign: 'right', marginRight: 20 }}>
      <Text>
        {translations.delivery}: {(total - withCampaignsTotal).toFixed(2)}
      </Text>
      <Text>
        {translations.discount}:{' '}
        {(productsTotal - withCampaignsTotal).toFixed(2)}
      </Text>
      <Text>
        {translations.total}: {(total - total * (18 / 100)).toFixed(2)}
      </Text>
      <Text style={{ marginTop: 8, fontWeight: 'bold' }}>
        {translations.totalWithTax}: {total.toFixed(2)}
      </Text>
    </View>
  );
};
