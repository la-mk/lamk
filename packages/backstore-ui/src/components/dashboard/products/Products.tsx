import React, { useState, useEffect } from 'react';
import { Tooltip, Flex, Table, Title, Button, SizedImage } from '@lamk/blocks-ui';
import { ColumnProps } from '@lamk/blocks-ui/dist/types/basic/Table';
import { ProductFormModal } from './ProductFormModal';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import { getProducts } from '../../../state/modules/products/products.selector';
import { Product } from '@lamk/la-sdk/dist/models/product';
import { sdk } from '@lamk/la-sdk';
import { setProducts } from '../../../state/modules/products/products.module';
import { useCall } from '../../shared/hooks/useCall';
import { FindResult } from '@lamk/la-sdk/dist/setup';

const columns: ColumnProps<Product>[] = [
  {
    title: 'Images',
    dataIndex: 'images',
    width: '180px',
    render: (_text, product) => {
      return (
        <SizedImage
          height='60px'
          width='120px'
          alt={product.name}
          src={sdk.artifact.getUrlForArtifact(product.images[0])}
        />
      );
    },
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Category',
    dataIndex: 'category',
  },
  {
    title: 'Price',
    dataIndex: 'price',
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
];

export const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [caller, showSpinner] = useCall();
  const [editingProduct, setEditingProduct] = useState();

  const products: Product[] = useSelector(getProducts);
  const store = useSelector(getStore);

  useEffect(() => {
    if (store) {
      caller(
        sdk.product.findForStore(store._id),
        (products: FindResult<Product>) => setProducts(products.data),
      );
    }
  }, [store]);

  return (
    <Flex flexDirection='column' px={[3, 3, 3, 4]} py={2}>
      <Title mb={3} level={2}>
        Products
      </Title>

      <Flex my={3} justifyContent='space-between'>
        <Button type='primary' onClick={() => setShowModal(true)}>
          Add Product
        </Button>
        <Tooltip title='You can do bulk actions using this button.'>
          <Button mx={3} type='ghost'>
            Actions
          </Button>
        </Tooltip>
      </Flex>

      <Table<Product>
        loading={showSpinner}
        dataSource={products}
        columns={columns}
        rowKey='_id'
        onRow={product => ({
          onClick: () => {
            setEditingProduct(product);
            setShowModal(true);
          },
        })}
      />

      <ProductFormModal
        product={editingProduct}
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(undefined);
        }}
      />
    </Flex>
  );
};
