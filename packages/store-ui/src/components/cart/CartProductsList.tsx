import React from 'react';
import {
  Flex,
  List,
  Image,
  Text,
  Button,
  InputNumber,
  Table,
  Title,
  Box,
  Divider,
} from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { Price } from '../shared/Price';
import { useTranslation } from '../../common/i18n';
import { TFunction } from 'next-i18next';
import { ColumnProps } from '@sradevski/blocks-ui/dist/basic/Table';
import { CartItemWithProduct } from '@sradevski/la-sdk/dist/models/cart';
import { CloseOutlined } from '@ant-design/icons';
import { Product } from '@sradevski/la-sdk/dist/models/product';

const ProductImageWithTitle = ({
  product,
  storeId,
}: {
  product: Product;
  storeId: string;
}) => {
  return (
    <Flex minWidth={200} alignItems='center' justifyContent='flex-start'>
      <Image
        maxWidth={80}
        minWidth={40}
        alt={product.name}
        src={
          sdk.artifact.getUrlForArtifact(product.images[0], storeId) ||
          undefined
        }
      />
      <Title
        mr={0}
        ml={4}
        my={0}
        level={2}
        fontSize={[1, 2, 2]}
        ellipsis={{ rows: 2 }}
      >
        {product.name}
      </Title>
    </Flex>
  );
};

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
        <InputNumber
          min={1}
          max={999}
          value={cartItem.quantity}
          onChange={value => handleChangeItemQuantity(cartItem, value)}
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
        <Text strong fontSize={2} color='primary'>
          {cartItem.quantity * cartItem.product.calculatedPrice} ден
        </Text>
      ),
    },
    {
      key: 'action',
      width: 30,
      render: (val, cartItem) => (
        <Button type='link' onClick={() => handleRemove(cartItem)}>
          <CloseOutlined />
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
        <List style={{ width: '100%' }}>
          {cartItems.map(cartItem => (
            <List.Item
              style={{ justifyContent: 'center' }}
              key={cartItem.product._id}
            >
              <Flex
                minWidth={320}
                px={3}
                flexDirection='column'
                style={{ position: 'relative' }}
              >
                <Box style={{ position: 'absolute', top: 0, right: 0 }}>
                  <Button type='link' onClick={() => handleRemove(cartItem)}>
                    <CloseOutlined />
                  </Button>
                </Box>
                <ProductImageWithTitle
                  product={cartItem.product}
                  storeId={storeId}
                />

                <Flex mt={4} alignItems='center' justifyContent='space-between'>
                  <Price
                    calculatedPrice={cartItem.product.calculatedPrice}
                    basePrice={cartItem.product.price}
                    currency='ден'
                  />
                  <InputNumber
                    width='80px'
                    min={1}
                    max={999}
                    value={cartItem.quantity}
                    onChange={value =>
                      handleChangeItemQuantity(cartItem, value)
                    }
                    mx={2}
                  />
                </Flex>
                <Box mt={2}>
                  <Text>Total:</Text>
                  <Text ml={2} color='primary'>
                    {cartItem.product.calculatedPrice * cartItem.quantity} ден
                  </Text>
                </Box>
              </Flex>
            </List.Item>
          ))}
        </List>
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
