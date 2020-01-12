import React, { useState, useEffect } from 'react';
import {
  Tooltip,
  Flex,
  Table,
  Title,
  Button,
  Image,
} from '@sradevski/blocks-ui';
import { ColumnProps } from '@sradevski/blocks-ui/dist/types/basic/Table';
import { ProductFormModal } from './ProductFormModal';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import { getProducts } from '../../../state/modules/products/products.selector';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import { setProducts } from '../../../state/modules/products/products.module';
import { useCall } from '../../shared/hooks/useCall';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { useTranslation } from 'react-i18next';
import { T } from '../../../config/i18n';
import { Store } from '@sradevski/la-sdk/dist/models/store';

const getColumns = (t: T) =>
  [
    {
      title: t('common.image_plural'),
      dataIndex: 'images',
      width: '180px',
      align: 'center',
      render: (_text, product) => {
        return (
          <Image
            maxHeight='60px'
            alt={product.name}
            src={sdk.artifact.getUrlForArtifact(product.images[0])}
          />
        );
      },
    },
    {
      title: t('common.name'),
      dataIndex: 'name',
    },
    {
      title: t('common.category'),
      dataIndex: 'category',
      render: category => t(`categories.${category}`),
    },
    {
      title: t('common.price'),
      dataIndex: 'price',
    },
    {
      title: t('common.description'),
      dataIndex: 'description',
    },
  ] as ColumnProps<Product>[];

export const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [caller, showSpinner] = useCall();
  const [editingProduct, setEditingProduct] = useState();
  const { t } = useTranslation();

  const products: Product[] = useSelector(getProducts);
  const store: Store | null = useSelector(getStore);
  const columns = getColumns(t);

  useEffect(() => {
    if (store) {
      caller<FindResult<Product>>(
        sdk.product.findForStore(store._id),
        products => setProducts(products.data),
      );
    }
  }, [caller, store]);

  return (
    <Flex flexDirection='column' px={[3, 3, 3, 4]} py={2}>
      <Title mb={3} level={2}>
        {t('commerce.product_plural')}
      </Title>

      <Flex my={3} justifyContent='space-between'>
        <Button type='primary' onClick={() => setShowModal(true)}>
          {t('actions.add')}
        </Button>
        <Tooltip title={t('common.actionsTip')}>
          <Button mx={3} type='ghost'>
            {t('common.action_plural')}
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
