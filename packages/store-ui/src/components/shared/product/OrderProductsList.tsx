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
      title: <Text size='lg'>{t('commerce.product')}</Text>,
      key: 'product',
      align: 'center',
      render: (_text, item) => {
        return (
          <ProductImageWithTitle product={item.product} storeId={storeId} />
        );
      },
    },
    {
      title: <Text size='lg'>{t('common.price')}</Text>,
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
      title: <Text size='lg'>{t('commerce.quantity')}</Text>,
      width: 150,
      key: 'quantity',
      render: (val, item) =>
        handleChangeItemQuantity ? (
          <Quantity
            cartItem={item as CartItemWithProduct}
            handleChangeItemQuantity={handleChangeItemQuantity}
          />
        ) : (
          <Text as='strong' color='heading.dark'>
            {item.quantity}
          </Text>
        ),
    },
    {
      title: <Text size='lg'>{t('finance.total')}</Text>,
      key: 'total',
      width: 150,
      render: (val, item) => (
        <Text as='strong' color='primary'>
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
              <Button variant='link' onClick={() => handleRemove(item)}>
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
    <Flex width='100%' direction='column'>
      <Box display={['block', 'none', 'none']}>
        <Flex align='center' justify='center' direction='column'>
          {items.map(item => (
            <>
              <Divider mb={2} />

              <Flex
                key={item.product._id}
                minWidth={320}
                maxWidth={520}
                width='100%'
                px={3}
                mb={5}
                direction='column'
                // @ts-ignore
                style={{ position: 'relative' }}
              >
                {/* @ts-ignore */}
                <Box style={{ position: 'absolute', top: 0, right: 0 }}>
                  {handleRemove && (
                    <Button variant='ghost' onClick={() => handleRemove(item)}>
                      <DeleteOutlined />
                    </Button>
                  )}
                </Box>
                <ProductImageWithTitle
                  product={item.product}
                  storeId={storeId}
                />

                <Flex mt={4} justify='space-between'>
                  <Flex justify='center'>
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
                  <Text as='strong' color='primary'>
                    {item.product.calculatedPrice * item.quantity} ден
                  </Text>
                </Box>
              </Flex>
            </>
          ))}
        </Flex>

        <Divider />
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

        <Divider mb={2} />
      </Box>
    </Flex>
  );
};
