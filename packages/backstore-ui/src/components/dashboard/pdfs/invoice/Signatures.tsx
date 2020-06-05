import React from 'react';
import { View, Text } from '@react-pdf/renderer';

const SignaureLine = ({ children }: { children: string }) => (
  <View
    style={{
      textAlign: 'center',
      width: 240,
      fontSize: 12,
      padding: 2,
      margin: '0 20px',
      borderTop: '1px solid black',
    }}
  >
    <Text>{children}</Text>
  </View>
);

export const Signatures = ({
  translations,
}: {
  translations: {
    received: string;
    handedOver: string;
    ceo: string;
  };
}) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <SignaureLine>{translations.received}</SignaureLine>
      <SignaureLine>{translations.handedOver}</SignaureLine>
      <SignaureLine>{translations.ceo}</SignaureLine>
    </View>
  );
};
