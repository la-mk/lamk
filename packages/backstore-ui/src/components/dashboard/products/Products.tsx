import React, { useState } from 'react';
import {
  Tooltip,
  Flex,
  Table,
  Title,
  Button,
  Image,
  hooks,
  utils,
} from '@sradevski/blocks-ui';
import { ColumnProps } from '@sradevski/blocks-ui/dist/basic/Table';
import { ProductFormModal } from './ProductFormModal';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import { getProducts } from '../../../state/modules/products/products.selector';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import { setProducts } from '../../../state/modules/products/products.module';
import { useTranslation } from 'react-i18next';
import { T } from '../../../config/i18n';
import { Store } from '@sradevski/la-sdk/dist/models/store';

const getColumns = (t: T, storeId: string) =>
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
            src={sdk.artifact.getUrlForArtifact(product.images[0], storeId)}
          />
        );
      },
    },
    {
      title: t('common.name'),
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('product.sku'),
      dataIndex: 'sku',
    },
    {
      title: t('common.category'),
      dataIndex: 'category',
      render: category => t(`categories.${category}`),
      sorter: (a, b) =>
        t(`categories.${a.category}`).localeCompare(`categories.${b.category}`),
    },
    {
      title: t('common.price'),
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: t('common.description'),
      dataIndex: 'description',
    },
  ] as ColumnProps<Product>[];

export const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState();
  const [total, setTotal] = useState<number | undefined>();
  const { t } = useTranslation();

  const products: Product[] = useSelector(getProducts);
  const store: Store | null = useSelector(getStore);
  const columns = getColumns(t, store ? store._id : '');

  const [caller, showSpinner] = hooks.useCall();
  const [filters, setFilters] = hooks.useFilter(null, {
    storage: 'session',
    storageKey: `${store ? store._id : ''}/productFilters`,
  });

  React.useEffect(() => {
    if (!store) {
      return;
    }

    caller(
      sdk.product.findForStore(store._id, utils.filter.filtersAsQuery(filters)),
      res => {
        setTotal(res.total);
        return setProducts(res.data);
      },
    );
  }, [store, filters]);

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
        dataSource={products}
        columns={columns}
        loading={showSpinner}
        pagination={{
          total: total || 0,
          current: filters.pagination ? filters.pagination.currentPage : 1,
          pageSize: filters.pagination ? filters.pagination.pageSize : 20,
        }}
        onChange={(pagination, tableFilters, sorter) => {
          setFilters({
            pagination: {
              pageSize: pagination.pageSize || 20,
              currentPage: pagination.current || 1,
            },
            sorting: {
              field: sorter.field,
              order: sorter.order,
            },
            filtering: {
              ...filters.filtering,
              // ...utils.filter.multipleItemsFilter(
              //   'status',
              //   tableFilters.status,
              // ),
            },
          });
        }}
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
