import React from 'react';
import {
  Flex,
  List,
  Text,
  Button,
  Table,
  Box,
  Divider,
} from '@sradevski/blocks-ui';
import { Price } from '../shared/product/Price';
import { useTranslation } from '../../common/i18n';
import { TFunction } from 'next-i18next';
import { ColumnProps } from '@sradevski/blocks-ui/dist/basic/Table';
import { CartItemWithProduct } from '@sradevski/la-sdk/dist/models/cart';
import { DeleteOutlined } from '@ant-design/icons';
import { ProductImageWithTitle } from '../shared/product/ProductImageWithTitle';
import { Quantity } from '../shared/product/Quantity';

const getColumns = (
  t: TFunction,
  storeId: string,
  handleChangeItemQuantity,
  handleRemove,
) =>
  [
    {
      title: (
        <Text color='mutedText.dark' fontSize={3}>
          {t('commerce.product')}
        </Text>
      ),
      key: 'product',
      align: 'center',
      render: (_text, cartItem) => {
        return (
          <ProductImageWithTitle product={cartItem.product} storeId={storeId} />
        );
      },
    },
    {
      title: (
        <Text color='mutedText.dark' fontSize={3}>
          {t('common.price')}
        </Text>
      ),
      key: 'price',
      width: 150,
      render: (val, cartItem) => (
        <Price
          size='small'
          vertical
          calculatedPrice={cartItem.product.calculatedPrice}
          basePrice={cartItem.product.price}
          currency='ден'
        />
      ),
    },
    {
      title: (
        <Text color='mutedText.dark' fontSize={3}>
          {t('commerce.quantity')}
        </Text>
      ),
      width: 150,
      key: 'quantity',
      render: (val, cartItem) => (
        <Quantity
          cartItem={cartItem}
          handleChangeItemQuantity={handleChangeItemQuantity}
        />
      ),
    },
    {
      title: (
        <Text color='mutedText.dark' fontSize={3}>
          {t('finance.total')}
        </Text>
      ),
      key: 'total',
      width: 150,
      render: (val, cartItem) => (
        <Text strong fontSize={1} color='primary'>
          {cartItem.quantity * cartItem.product.calculatedPrice} ден
        </Text>
      ),
    },
    {
      key: 'action',
      width: 30,
      render: (val, cartItem) => (
        <Button type='link' onClick={() => handleRemove(cartItem)}>
          <DeleteOutlined />
        </Button>
      ),
    },
  ] as ColumnProps<CartItemWithProduct>[];

export const CartProductsList = ({
  cartItems,
  storeId,
  handleRemove,
  handleChangeItemQuantity,
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
          {cartItems.map(cartItem => (
            <>
              <Divider mt={0} />

              <Flex
                key={cartItem.product._id}
                minWidth={320}
                maxWidth={520}
                width='100%'
                px={3}
                mb={5}
                flexDirection='column'
                style={{ position: 'relative' }}
              >
                <Box style={{ position: 'absolute', top: -20, right: 0 }}>
                  <Button type='link' onClick={() => handleRemove(cartItem)}>
                    <DeleteOutlined />
                  </Button>
                </Box>
                <ProductImageWithTitle
                  product={cartItem.product}
                  storeId={storeId}
                />

                <Flex mt={4} justifyContent='space-between'>
                  <Flex justifyContent='center'>
                    <Text mr={2}>Price:</Text>
                    <Price
                      vertical
                      size='small'
                      calculatedPrice={cartItem.product.calculatedPrice}
                      basePrice={cartItem.product.price}
                      currency='ден'
                    />
                  </Flex>

                  <Box>
                    <Quantity
                      mx={2}
                      cartItem={cartItem}
                      handleChangeItemQuantity={handleChangeItemQuantity}
                    />
                  </Box>
                </Flex>
                <Box mt={2}>
                  <Text mr={2}>Total:</Text>
                  <Text color='primary' strong>
                    {cartItem.product.calculatedPrice * cartItem.quantity} ден
                  </Text>
                </Box>
              </Flex>
            </>
          ))}
        </Flex>

        <Divider mt={0} />
      </Box>

      <Box display={['none', 'block', 'block']}>
        <Table
          pagination={false}
          dataSource={cartItems}
          columns={getColumns(
            t,
            storeId,
            handleChangeItemQuantity,
            handleRemove,
          )}
          rowKey='product._id'
        />

        <Divider my={0} />
      </Box>
    </Flex>
  );
};
