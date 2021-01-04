import React from 'react';
import { Page, Text, Image, View, Document, Font } from '@react-pdf/renderer';
import { StoreInformation } from './StoreInformation';
import { BuyerInformation } from './BuyerInformation';
import { OrderItemsTable } from './OrderItemsTable';
import { Order } from '@la-mk/la-sdk/dist/models/order';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { OrderSummary, PricesSummary } from './OrderSummary';
import { Signatures } from './Signatures';

export interface InvoiceProps {
  logoUrl: string | null;
  order: Order;
  store: Store;
  pricesSummary: PricesSummary;
}

Font.register({
  family: 'SkolaSans',
  fonts: [
    {
      src: '/fonts/SkolaSans-Regular.ttf',
      fontStyle: 'normal',
      fontWeight: 'normal',
    },
    {
      src: '/fonts/SkolaSans-Bold.ttf',
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
  ],
});

// TODO: Un-hardcode these
const translations = {
  invoice: 'Фактура',
  taxNumberAcronym: 'ЕДБ',
  id: 'Шифра',
  orderId: 'Шифра на порачка',
  buyer: 'Клиент',
  issuedOn: 'Издадена на',
  product: 'Производ',
  quantity: 'Количина',
  price: 'Цена',
  discount: 'Попуст',
  tax: 'ДДВ',
  index: 'бр.',
  amountWithTax: 'Износ (со ДДВ)',
  delivery: 'Достава',
  total: 'Вкупно',
  totalWithTax: 'Вкупно (со ДДВ)',
  received: 'Примил',
  handedOver: 'Предал',
  ceo: 'Директор',
};

// TODO: Handle tax properly (add to pricing.ts calculation, and allow to define it on the product.)

export const Invoice = ({
  logoUrl,
  order,
  store,
  pricesSummary,
}: InvoiceProps) => {
  if (!order || !store) {
    return null;
  }

  return (
    <Document>
      <Page
        size='A4'
        style={{
          padding: 20,
          fontSize: 10,
          fontFamily: 'SkolaSans',
          lineHeight: 1.33,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          {logoUrl && (
            <Image
              src={logoUrl}
              style={{ maxHeight: 64, objectFit: 'contain' }}
            />
          )}

          <StoreInformation store={store} translations={translations} />
        </View>

        <View style={{ marginTop: 20 }}>
          <BuyerInformation
            buyer={order.deliverTo}
            translations={translations}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            {translations.invoice} {new Date(order.createdAt).getTime()}
          </Text>
          <Text style={{ marginTop: 4, fontSize: 8 }}>
            {translations.issuedOn}:{' '}
            {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between' }}
        ></View>

        <View style={{ marginTop: 20 }}>
          <OrderItemsTable
            orderedItems={order.ordered}
            translations={translations}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <OrderSummary
            pricesSummary={pricesSummary}
            translations={translations}
          />
        </View>

        <View style={{ marginTop: 60 }}>
          <Signatures translations={translations} />
        </View>

        <View style={{ marginTop: 60 }}>
          <Text style={{ fontSize: 8 }}>
            {translations.orderId}: {order._id}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
