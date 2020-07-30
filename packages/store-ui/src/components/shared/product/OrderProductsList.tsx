import React from 'react';
import { Flex, Text, Button, Table, Box, Divider } from '@sradevski/blocks-ui';
import { Price } from './Price';
import { useTranslation } from '../../../common/i18n';
import { TFunction } from 'next-i18next';
import { ColumnProps } from '@sradevski/blocks-ui/dist/basic/Table';
import { CartItemWithProduct } from '@sradevski/la-sdk/dist/models/cart';
import { DeleteOutlined } from '@ant-design/icons';
import { ProductImageWithTitle } from './ProductImageWithTitle';
import { Quantity } from './Quantity';
import { OrderItem } from '@sradevski/la-sdk/dist/models/order';
import styled from 'styled-components';

const HoverlessTable = styled(Table)<{ lightBackground: boolean }>`
  &&&& tr:hover td {
    background: inherit;
  }

  .ant-table-thead th {
    background: ${props =>
      props.lightBackground ? props.theme.colors.background.light : 'inherit'};
    border-bottom: 1px solid ${props => props.theme.colors.mutedText.light};
  }
  .ant-table-tbody {
    background: ${props =>
      props.lightBackground ? props.theme.colors.background.light : 'inherit'};
  }
`;

const getColumns = (
  t: TFunction,
  storeId: string,
  handleChangeItemQuantity,
  handleRemove,
) =>
  [
    {
      title: <Text fontSize={2}>{t('commerce.product')}</Text>,
      key: 'product',
      align: 'center',
      render: (_text, item) => {
        return (
          <ProductImageWithTitle product={item.product} storeId={storeId} />
        );
      },
    },
    {
      title: <Text fontSize={2}>{t('common.price')}</Text>,
      key: 'price',
      width: 150,
      render: (val, item) => (
        <Price
          size='small'
          vertical
          minCalculatedPrice={item.product.calculatedPrice}
          maxCalculatedPrice={item.product.calculatedPrice}
          minPrice={item.product.price}
          maxPrice={item.product.price}
          currency='ден'
        />
      ),
    },
    {
      title: <Text fontSize={2}>{t('commerce.quantity')}</Text>,
      width: 150,
      key: 'quantity',
      render: (val, item) =>
        handleChangeItemQuantity ? (
          <Quantity
            cartItem={item as CartItemWithProduct}
            handleChangeItemQuantity={handleChangeItemQuantity}
          />
        ) : (
          <Text strong color='heading.dark'>
            {item.quantity}
          </Text>
        ),
    },
    {
      title: <Text fontSize={2}>{t('finance.total')}</Text>,
      key: 'total',
      width: 150,
      render: (val, item) => (
        <Text strong fontSize={1} color='primary'>
          {item.quantity * item.product.calculatedPrice} ден
        </Text>
      ),
    },
    ...(handleRemove
      ? [
          {
            key: 'action',
            width: 30,
            render: (val, item) => (
              <Button type='link' onClick={() => handleRemove(item)}>
                <DeleteOutlined />
              </Button>
            ),
          },
        ]
      : []),
  ] as ColumnProps<CartItemWithProduct | OrderItem>[];

export const OrderProductsList = ({
  items,
  storeId,
  handleRemove,
  handleChangeItemQuantity,
  lightBackground,
}: any) => {
  const { t } = useTranslation();
  return (
    <Flex width='100%' flexDirection='column'>
      <Box display={['block', 'none', 'none']}>
        <Flex
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
        >
          {items.map(item => (
            <>
              <Divider style={{ borderTop: `1px solid ${'#D3DDE6'}` }} mt={0} />

              <Flex
                key={item.product._id}
                minWidth={320}
                maxWidth={520}
                width='100%'
                px={3}
                mb={5}
                flexDirection='column'
                style={{ position: 'relative' }}
              >
                <Box style={{ position: 'absolute', top: -20, right: 0 }}>
                  {handleRemove && (
                    <Button type='link' onClick={() => handleRemove(item)}>
                      <DeleteOutlined />
                    </Button>
                  )}
                </Box>
                <ProductImageWithTitle
                  product={item.product}
                  storeId={storeId}
                />

                <Flex mt={4} justifyContent='space-between'>
                  <Flex justifyContent='center'>
                    <Text mr={2}>Price:</Text>
                    <Price
                      vertical
                      size='small'
                      minCalculatedPrice={item.product.calculatedPrice}
                      maxCalculatedPrice={item.product.calculatedPrice}
                      minPrice={item.product.price}
                      maxPrice={item.product.price}
                      currency='ден'
                    />
                  </Flex>

                  <Box>
                    {handleChangeItemQuantity ? (
                      <Quantity
                        mx={2}
                        cartItem={item}
                        handleChangeItemQuantity={handleChangeItemQuantity}
                      />
                    ) : (
                      <Text>
                        {t('commerce.quantity')}: {item.quantity}
                      </Text>
                    )}
                  </Box>
                </Flex>
                <Box mt={2}>
                  <Text mr={2}>Total:</Text>
                  <Text color='primary' strong>
                    {item.product.calculatedPrice * item.quantity} ден
                  </Text>
                </Box>
              </Flex>
            </>
          ))}
        </Flex>

        <Divider mt={0} style={{ borderTop: `1px solid ${'#D3DDE6'}` }} />
      </Box>

      <Box display={['none', 'block', 'block']}>
        <HoverlessTable
          lightBackground={lightBackground}
          pagination={false}
          dataSource={items}
          columns={getColumns(
            t,
            storeId,
            handleChangeItemQuantity,
            handleRemove,
          )}
          rowKey='product._id'
        />

        <Divider
          style={{ borderTop: `1px solid ${'#D3DDE6'}` }}
          mt={0}
          mb={2}
        />
      </Box>
    </Flex>
  );
};
