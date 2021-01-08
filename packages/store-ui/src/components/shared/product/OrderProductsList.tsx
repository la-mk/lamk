import React from 'react';
import { Flex, Text, Button, Box, Table, Divider } from '@la-mk/blocks-ui';
import { Price } from './Price';
import { useTranslation } from '../../../common/i18n';
import { TFunction } from 'next-i18next';
import { CartItemWithProduct } from '@la-mk/la-sdk/dist/models/cart';
import { DeleteOutlined } from '@ant-design/icons';
import { ProductImageWithTitle } from './ProductImageWithTitle';
import { Quantity } from './Quantity';
import { OrderItem } from '@la-mk/la-sdk/dist/models/order';
import { TableColumnProps } from '@la-mk/blocks-ui/dist/basic/Table';

const getColumns = (
  t: TFunction,
  storeId: string,
  handleChangeItemQuantity,
  handleRemove,
) =>
  [
    {
      title: t('commerce.product'),
      key: 'product',
      render: (_text, item) => {
        return (
          <ProductImageWithTitle product={item.product} storeId={storeId} />
        );
      },
    },
    {
      title: t('common.price'),
      key: 'price',
      render: (_val, item) => (
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
      title: t('commerce.quantity'),
      key: 'quantity',
      render: (_val, item) =>
        handleChangeItemQuantity ? (
          <Quantity
            cartItem={item as CartItemWithProduct}
            handleChangeItemQuantity={handleChangeItemQuantity}
          />
        ) : (
          <Text color='heading.dark'>{item.quantity}</Text>
        ),
    },
    {
      title: t('finance.total'),
      key: 'total',
      isNumeric: true,
      render: (val, item) => (
        <Text as='strong' color='primary.500'>
          {item.quantity * item.product.calculatedPrice} ден
        </Text>
      ),
    },
    ...(handleRemove
      ? [
          {
            key: 'action',
            render: (val, item) => (
              <Button
                variant='ghost'
                leftIcon={<DeleteOutlined />}
                aria-label={t('actions.delete')}
                onClick={() => handleRemove(item)}
              />
            ),
          },
        ]
      : []),
  ] as TableColumnProps<CartItemWithProduct | OrderItem>[];

const OrderProductListItem = ({
  item,
  storeId,
  handleRemove,
  handleChangeItemQuantity,
  t,
}: Pick<
  OrderProductsListProps,
  'storeId' | 'handleChangeItemQuantity' | 'handleRemove'
> & { item: OrderItem | CartItemWithProduct; t: TFunction }) => {
  return (
    <Flex
      key={item.product._id}
      width='100%'
      px={[2, 3, 3]}
      pt={5}
      mb={5}
      direction='column'
      // @ts-ignore
      style={{ position: 'relative' }}
    >
      {/* @ts-ignore */}
      <Box style={{ position: 'absolute', top: 0, right: 0 }}>
        {handleRemove && (
          <Button
            variant='ghost'
            onClick={() => handleRemove(item)}
            leftIcon={<DeleteOutlined />}
          />
        )}
      </Box>
      <ProductImageWithTitle product={item.product} storeId={storeId} />

      <Flex mt={6} justify='space-between'>
        <Flex justify='center'>
          <Text mr={2}>Price:</Text>
          <Price
            vertical
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
              cartItem={item as CartItemWithProduct}
              handleChangeItemQuantity={handleChangeItemQuantity}
            />
          ) : (
            <Text>
              {t('commerce.quantity')}: {item.quantity}
            </Text>
          )}
        </Box>
      </Flex>
      <Box mt={3}>
        <Text mr={2}>Total:</Text>
        <Text as='strong' color='primary'>
          {item.product.calculatedPrice * item.quantity} ден
        </Text>
      </Box>
    </Flex>
  );
};

export interface OrderProductsListProps {
  items: Array<OrderItem | CartItemWithProduct>;
  storeId: string;
  handleRemove?: (item: OrderItem | CartItemWithProduct) => void;
  handleChangeItemQuantity?: (item: CartItemWithProduct, val: number) => void;
}

export const OrderProductsList = ({
  items,
  storeId,
  handleRemove,
  handleChangeItemQuantity,
}: OrderProductsListProps) => {
  const { t } = useTranslation();
  return (
    <Flex width='100%' direction='column'>
      <Box display={['block', 'block', 'none']}>
        <Flex
          minWidth={'18rem'}
          align='center'
          justify='center'
          direction='column'
        >
          {items.map(item => (
            <>
              <Divider mb={2} />
              <OrderProductListItem
                storeId={storeId}
                handleRemove={handleRemove}
                handleChangeItemQuantity={handleChangeItemQuantity}
                item={item}
                t={t}
              />
            </>
          ))}
        </Flex>

        <Divider />
      </Box>

      <Box display={['none', 'none', 'block']}>
        <Table
          data={items}
          // @ts-ignore
          columns={getColumns(
            t,
            storeId,
            handleChangeItemQuantity,
            handleRemove,
          )}
          rowKey='product._id'
        />
      </Box>
    </Flex>
  );
};
