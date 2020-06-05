import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { Store } from '@sradevski/la-sdk/dist/models/store';

export const StoreInformation = ({
  store,
  translations,
}: {
  store: Store;
  translations: { taxNumberAcronym: string };
}) => {
  return (
    //TODO: There is a bug where if you align the text to the right it will overflow without maxWidth and the margin.
    <View style={{ maxWidth: 300, marginRight: 85, textAlign: 'right' }}>
      <Text style={{ fontWeight: 'bold' }}>{store.name}</Text>

      <Text style={{ marginTop: 10 }}>{store.contact?.phoneNumber}</Text>
      <Text>{store.contact?.alternatePhoneNumber}</Text>
      <Text>{store.contact?.email}</Text>

      <Text style={{ marginTop: 10 }}>
        {translations.taxNumberAcronym}: {store.company?.taxNumber}
      </Text>
      <Text>{store.company?.companyAddress}</Text>
      <Text>{store.company?.companyName}</Text>
    </View>
  );
};
