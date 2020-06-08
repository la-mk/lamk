import pick from 'lodash/pick';
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
  Search,
  Box,
  Tag,
  Text,
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
import { Category } from '@sradevski/la-sdk/dist/models/category';
import { getUniqueCategories } from '../../../state/modules/categories/categories.selector';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';

const searchSupportedFields = [
  'name',
  'sku',
  'soldBy',
  'description',
  'calculatedPrice',
  'category',
  'createdAt',
];

const normalizeFilters = (filters: FilterObject) => {
  if (filters.searching) {
    filters.filtering = pick(filters.filtering, searchSupportedFields);
    filters.sorting = searchSupportedFields.includes(
      filters.sorting?.field ?? '',
    )
      ? filters.sorting
      : undefined;

    return filters;
  }

  return filters;
};

const getColumns = (
  t: T,
  storeId: string,
  categories: Category[] | null,
  filters: FilterObject,
) =>
  [
    {
      title: t('common.image_plural'),
      dataIndex: 'images',
      width: '180px',
      align: 'center',
      render: (_text, product) => {
        return (
          <Image
            minHeight='60px'
            height='60px'
            alt={product.name}
            src={
              sdk.artifact.getUrlForArtifact(product.images[0], storeId) ||
              undefined
            }
          />
        );
      },
    },
    {
      title: t('common.name'),
      dataIndex: 'name',
    },
    {
      title: t('product.sku'),
      dataIndex: 'sku',
    },
    {
      title: t('common.price'),
      dataIndex: 'calculatedPrice',
      filters: [
        {
          text: t('product.discount'),
          value: 'discounted',
        },
      ],
      filteredValue: filters.filtering.discount ? ['discounted'] : undefined,
      filterMultiple: false,
      onFilter: (value, record) =>
        value === 'discounted' ? (record.discount ?? 0) > 0 : true,
      sortOrder:
        filters.sorting?.field === 'calculatedPrice'
          ? filters.sorting?.order
          : undefined,
      sorter: (a, b) => a.calculatedPrice - b.calculatedPrice,
      render: (val, record) => (
        <Text color={record.discount ? 'danger' : 'text.dark'}>{val}</Text>
      ),
    },
    {
      title: t('product.stock'),
      dataIndex: 'stock',
      filters: [
        {
          text: t('product.outOfStock'),
          value: 0,
        },
      ],
      filteredValue: filters.filtering.stock
        ? [filters.filtering.stock]
        : undefined,
      filterMultiple: false,
      onFilter: (value, record) => record.stock === value,
      sortOrder:
        filters.sorting?.field === 'stock' ? filters.sorting?.order : undefined,
      sorter: (a, b) => (a.stock ?? 0) - (b.stock ?? 0),
      render: val => <Text>{val}</Text>,
    },
    {
      title: t('common.category'),
      dataIndex: 'category',
      filters: categories
        ? categories.map(category => ({
            text: t(`categories.${category}`),
            value: category,
          }))
        : [],
      filteredValue:
        filters.filtering?.category?.$in ??
        (filters.filtering?.category ? [filters.filtering?.category] : []),
      onFilter: (value, record) => record.category === value,
      render: category => t(`categories.${category}`),
    },
    {
      title: t('product.groups'),
      dataIndex: 'groups',
      render: (groups: Product['groups']) => {
        if (!groups || !groups.length) {
          return null;
        }

        return (
          <Flex flexWrap={'wrap'}>
            {groups.map(group => (
              <Tag compact m={1}>
                {group}
              </Tag>
            ))}
          </Flex>
        );
      },
    },
  ] as ColumnProps<Product>[];

export const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(
    undefined,
  );
  const [total, setTotal] = useState<number | undefined>();
  const { t } = useTranslation();

  const products: Product[] = useSelector(getProducts);
  const store: Store | null = useSelector(getStore);

  const [caller, showSpinner] = hooks.useCall();
  // We set category as undefined so on the first filter change the pagination won't reset (this is what is returned from multipleItemsFilter)
  const [filters, setFilters] = hooks.useFilter(
    { filtering: { category: undefined } },
    {
      storage: 'session',
      storageKey: `${store ? store._id : ''}/productFilters`,
    },
  );
  const categories = useSelector(getUniqueCategories('level3'));
  const columns = React.useMemo(() => {
    return getColumns(t, store ? store._id : '', categories, filters);
  }, [store, categories, filters, t]);

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
  }, [store, filters, caller]);

  return (
    <Flex flexDirection='column' px={[3, 3, 4]} py={2}>
      <Title mb={3} level={2}>
        {t('commerce.product_plural')}
      </Title>

      <Flex my={3} justifyContent='space-between'>
        <Button
          type='primary'
          onClick={() => {
            setEditingProduct(undefined);
            setShowModal(true);
          }}
        >
          {t('actions.add')}
        </Button>
        <Tooltip title={t('common.actionsTip')}>
          {/* <Button mx={3} type='ghost'>
            {t('common.action_plural')}
          </Button> */}
        </Tooltip>
      </Flex>

      <Box
        maxWidth='600px'
        width={['100%', '60%', '40%']}
        mx='auto'
        mt={2}
        mb={3}
      >
        <Search
          size='large'
          allowClear
          placeholder={`${t('actions.search')}: ${t(
            'common.name',
          ).toLowerCase()}, ${t('product.sku').toLowerCase()}, ${t(
            'common.description',
          ).toLowerCase()}`}
          defaultValue={filters.searching}
          onSearch={value => {
            setFilters(normalizeFilters({ ...filters, searching: value }));
          }}
          enterButton
        />
      </Box>

      <Table<Product>
        dataSource={products}
        columns={columns}
        loading={showSpinner}
        pagination={{
          total: total || 0,
          showSizeChanger: false,
          current: filters.pagination ? filters.pagination.currentPage : 1,
          pageSize: filters.pagination ? filters.pagination.pageSize : 20,
        }}
        onChange={(pagination, tableFilters, sorter) => {
          const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;

          setFilters(
            normalizeFilters({
              pagination: {
                pageSize: pagination.pageSize || 20,
                currentPage: pagination.current || 1,
              },
              sorting:
                singleSorter?.field && singleSorter?.order
                  ? {
                      field: singleSorter.field as string,
                      order: singleSorter.order,
                    }
                  : undefined,
              filtering: {
                ...filters.filtering,
                ...utils.filter.singleItemFilter(
                  'stock',
                  tableFilters.stock?.[0],
                ),
                ...utils.filter.rangeFilter(
                  'discount',
                  tableFilters.calculatedPrice?.[0] === 'discounted' ? 1 : null,
                  null,
                  0,
                  Infinity,
                ),
                ...utils.filter.multipleItemsFilter(
                  'category',
                  tableFilters.category,
                ),
              },
              searching: filters.searching,
            }),
          );
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
