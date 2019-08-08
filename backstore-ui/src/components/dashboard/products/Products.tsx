import React, { useState, useEffect } from 'react';
import { Tooltip } from 'blocks-ui/dist/basic/Tooltip';
import { Flex } from 'blocks-ui/dist/basic/Flex';
import { Table, ColumnProps } from 'blocks-ui/dist/basic/Table';
import { Title } from 'blocks-ui/dist/basic/Typography';
import { Button } from 'blocks-ui/dist/basic/Button';
import { ProductFormModal } from './ProductFormModal';
import { useSelector, useDispatch } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import { getProducts } from '../../../state/modules/products/products.selector';
import { Product } from 'la-sdk/dist/models/product';
import { sdk } from 'la-sdk';
import { SizedImage } from 'blocks-ui/dist/compound/SizedImage';
import { setProducts } from '../../../state/modules/products/products.module';
import { message } from 'blocks-ui/dist/static/message';

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
  const [showSpinner, setShowSpinner] = useState(false);
  const [editingProduct, setEditingProduct] = useState();

  const products: Product[] = useSelector(getProducts);
  const store = useSelector(getStore);
  const dispatch = useDispatch();

  useEffect(() => {
    if (store._id) {
      setShowSpinner(true);
      sdk.product
        .findForStore(store._id)
        .then(products => {
          dispatch(setProducts(products.data));
        })
        .catch(err => message.error(err.message))
        .finally(() => setShowSpinner(false));
    }
  }, [store, dispatch]);

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
        storeId={store._id}
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(undefined);
        }}
      />
    </Flex>
  );
};
