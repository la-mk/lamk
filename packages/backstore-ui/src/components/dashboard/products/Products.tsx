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
  Modal,
} from '@sradevski/blocks-ui';
import { ColumnProps } from '@sradevski/blocks-ui/dist/basic/Table';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import {
  getProducts,
  getGroups,
} from '../../../state/modules/products/products.selector';
import { Product, Variant } from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import {
  setProducts,
  setGroups,
} from '../../../state/modules/products/products.module';
import { useTranslation } from 'react-i18next';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { Category } from '@sradevski/la-sdk/dist/models/category';
import { getUniqueCategories } from '../../../state/modules/categories/categories.selector';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { ProductGroup } from '@sradevski/la-sdk/dist/models/productGroup';
import { TFunction } from 'i18next';
import { ProductForm } from './ProductForm';

const searchSupportedFields = [
  'name',
  'sku',
  'soldBy',
  'description',
  'minCalculatedPrice',
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
  t: TFunction,
  storeId: string,
  categories: Category[] | null,
  groups: string[],
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
          <Box minHeight='60px' height='60px'>
            <Image
              height={60}
              alt={product.name}
              getSrc={params =>
                sdk.artifact.getUrlForImage(product.images[0], storeId, params)
              }
            />
          </Box>
        );
      },
    },
    {
      title: t('common.name'),
      dataIndex: 'name',
    },
    {
      title: t('product.sku'),
      dataIndex: 'variants',
      render: (val: Variant[], record) => {
        return (
          <Text maxWidth={140} ellipsis>
            {val
              .map(x => x.sku)
              .filter(x => !!x)
              .join(', ')}
          </Text>
        );
      },
    },
    {
      title: t('common.price'),
      dataIndex: 'minCalculatedPrice',
      filters: [
        {
          text: t('product.discount'),
          value: 'discounted',
        },
      ],
      filteredValue: filters.filtering.maxDiscount ? ['discounted'] : undefined,
      filterMultiple: false,
      onFilter: (value, record) =>
        value === 'discounted' ? (record.maxDiscount ?? 0) > 0 : true,
      sortOrder:
        filters.sorting?.field === 'minCalculatedPrice'
          ? filters.sorting?.order
          : undefined,
      sorter: (a, b) =>
        (a.minCalculatedPrice ?? 0) - (b.minCalculatedPrice ?? 0),
      render: (val, record) => (
        <Text color={record.maxDiscount ? 'danger' : 'text.dark'}>
          {record.minCalculatedPrice === record.maxCalculatedPrice
            ? val
            : `${record.minCalculatedPrice} ~ ${record.maxCalculatedPrice}`}
        </Text>
      ),
    },
    {
      title: t('product.stock'),
      dataIndex: 'totalStock',
      filters: [
        {
          text: t('product.outOfStock'),
          value: 0,
        },
      ],
      filteredValue: filters.filtering.totalStock
        ? [filters.filtering.totalStock]
        : undefined,
      filterMultiple: false,
      onFilter: (value, record) => record.totalStock === value,
      sortOrder:
        filters.sorting?.field === 'totalStock'
          ? filters.sorting?.order
          : undefined,
      sorter: (a, b) => (a.totalStock ?? 0) - (b.totalStock ?? 0),
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
      filters: groups
        ? groups.map(group => ({
            text: group,
            value: group,
          }))
        : [],
      filteredValue:
        filters.filtering?.groups?.$in ??
        (filters.filtering?.groups ? [filters.filtering?.groups] : []),
      onFilter: (value, record) => record.groups.includes(value as string),
      render: (groups: Product['groups']) => {
        if (!groups || !groups.length) {
          return null;
        }

        return (
          <Flex wrap={'wrap'}>
            {groups.map(group => (
              <Tag size='sm' m={1}>
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

  const groups: string[] = useSelector(getGroups);
  const products: Product[] = useSelector(getProducts);
  const store: Store | null = useSelector(getStore);
  const storeId = store?._id;

  const [caller, showSpinner] = hooks.useCall();
  const [groupsCaller] = hooks.useCall();

  // We set category as undefined so on the first filter change the pagination won't reset (this is what is returned from multipleItemsFilter)
  const [filters, setFilters] = hooks.useFilter(
    {
      filtering: {
        category: undefined,
        groups: undefined,
        maxDiscount: undefined,
        totalStock: undefined,
      },
    },
    {
      storage: 'session',
      storageKey: `${store ? store._id : ''}/productFilters`,
    },
  );
  const categories = useSelector(getUniqueCategories('level3'));
  const columns = React.useMemo(() => {
    return getColumns(t, storeId ?? '', categories, groups, filters);
  }, [storeId, categories, groups, filters, t]);

  React.useEffect(() => {
    if (!storeId) {
      return;
    }

    caller(
      sdk.product.findForStore(storeId, utils.filter.filtersAsQuery(filters)),
      res => {
        setTotal(res.total);
        return setProducts(res.data);
      },
    );
  }, [storeId, filters, caller]);

  React.useEffect(() => {
    if (!storeId) {
      return;
    }

    groupsCaller<FindResult<ProductGroup>>(
      sdk.productGroup.findForStore(storeId),
      productGroups => setGroups(productGroups.data.map(x => x.groupName)),
    );
  }, [storeId, groupsCaller]);

  const onClose = () => {
    setShowModal(false);
    setEditingProduct(undefined);
  };

  return (
    <Flex direction='column' px={[3, 3, 4]} py={2}>
      <Title mb={3} level={2}>
        {t('commerce.product_plural')}
      </Title>

      <Flex my={3} justify='space-between'>
        <Button
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
                pageSize: pagination.pageSize ?? 20,
                currentPage: pagination.current ?? 1,
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
                  'totalStock',
                  tableFilters.totalStock?.[0],
                ),
                ...utils.filter.rangeFilter(
                  'maxDiscount',
                  tableFilters.minCalculatedPrice?.[0] === 'discounted'
                    ? 1
                    : null,
                  null,
                  0,
                  Infinity,
                ),
                ...utils.filter.multipleItemsFilter(
                  'category',
                  tableFilters.category,
                ),
                ...utils.filter.multipleItemsFilter(
                  'groups',
                  tableFilters.groups,
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

      <Modal
        width={'80%'}
        centered
        destroyOnClose
        visible={showModal}
        footer={null}
        onCancel={onClose}
        title={editingProduct ? t('actions.update') : t('actions.add')}
      >
        <ProductForm product={editingProduct} onClose={onClose} />
      </Modal>
    </Flex>
  );
};
