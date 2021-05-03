import pick from 'lodash/pick';
import React, { useState } from 'react';
import {
  Flex,
  Button,
  Image,
  hooks,
  utils,
  Box,
  Tag,
  Text,
  Modal,
  Spinner,
  AdvancedTableColumnProps,
  AdvancedTable,
  Checkbox,
} from '@la-mk/blocks-ui';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import {
  getProducts,
  getGroups,
} from '../../../state/modules/products/products.selector';
import { Product, Variant } from '@la-mk/la-sdk/dist/models/product';
import { sdk } from '@la-mk/la-sdk';
import {
  setProducts,
  setGroups,
} from '../../../state/modules/products/products.module';
import { useTranslation } from 'react-i18next';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { FilterObject } from '@la-mk/blocks-ui/dist/hooks/useFilter';
import { FindResult } from '@la-mk/la-sdk/dist/setup';
import { ProductGroup } from '@la-mk/la-sdk/dist/models/productGroup';
import { TFunction } from 'i18next';
import { ProductForm } from './ProductForm';
import { getFilter } from '../../shared/utils/table';

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
  const updatedFilters = {
    ...filters.filtering,
    maxDiscount: filters.filtering?.minCalculatedPrice,
  };
  delete updatedFilters.minCalculatedPrice;

  filters.filtering = updatedFilters;

  if (filters.searching) {
    filters.filtering = pick(updatedFilters, searchSupportedFields);
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
  groups: string[],
): AdvancedTableColumnProps<Product>[] => [
  {
    Header: t('common.image_plural'),
    accessor: 'media',
    disableFilters: true,
    disableSortBy: true,
    compressed: true,
    Cell: ({ row }: any) => {
      return (
        <Box minHeight='60px' height='60px'>
          <Image
            height={60}
            alt={row.original.name}
            getSrc={params =>
              sdk.artifact.getUrlForImage(
                row.original.media[0]?._id,
                storeId,
                params,
              )
            }
          />
        </Box>
      );
    },
  },
  {
    Header: t('common.name'),
    accessor: 'name',
    disableFilters: true,
  },
  {
    Header: t('product.sku'),
    accessor: 'variants',
    disableFilters: true,
    disableSortBy: true,
    compressed: true,
    Cell: ({ value }: { value: Variant[] }) => {
      return (
        <Text maxWidth={'140px'} noOfLines={1}>
          {value
            .map(x => x.sku)
            .filter(x => !!x)
            .join(', ')}
        </Text>
      );
    },
  },
  {
    Header: t('common.price'),
    accessor: 'minCalculatedPrice',
    compressed: true,
    Filter: ({ column, setFilter }: any) => {
      let val = column.filterValue;
      if (val) {
        val = val.$gte;
      }

      // TODO: We actually want to set maxDiscount, but it's not supported here.
      const filterVal = utils.filter.rangeFilter(
        'minCalculatedPrice',
        1,
        null,
        0,
        Infinity,
      )['minCalculatedPrice'];

      return (
        <Checkbox
          onChange={e =>
            setFilter('minCalculatedPrice', e.target.checked ? filterVal : null)
          }
          isChecked={val === 1}
          my={1}
        >
          {t('product.discount')}
        </Checkbox>
      );
    },
    Cell: ({ value, row }: any) => (
      <Text color={row.original.maxDiscount ? 'danger' : 'text.dark'}>
        {row.original.minCalculatedPrice === row.original.maxCalculatedPrice
          ? value
          : `${row.original.minCalculatedPrice} ~ ${row.original.maxCalculatedPrice}`}
      </Text>
    ),
  },
  {
    Header: t('product.stock'),
    accessor: 'totalStock',
    compressed: true,
    Filter: ({ column }: any) => {
      const val = column.filterValue;

      return (
        <Checkbox
          isChecked={val === '0'}
          onChange={() => {
            // TODO: Filters gets removed if it is falsy (0), so we use a string instead, which works fine with our backend
            // Cause https://github.com/tannerlinsley/react-table/blob/fa662bc33d4356b79390dd24140b5cc56b75e1d6/src/plugin-hooks/useFilters.js#L78
            column.setFilter(
              utils.filter.singleItemFilter(
                'totalStock',
                val === '0' ? null : '0',
              )['totalStock'],
            );
          }}
          my={1}
        >
          {t('product.outOfStock')}
        </Checkbox>
      );
    },
  },
  {
    Header: t('common.category'),
    accessor: 'category',
    disableFilters: true,
    disableSortBy: true,
    Cell: ({ value }: any) => t(`categories.${value}`),
  },
  {
    Header: t('product.groups'),
    accessor: 'groups',
    disableSortBy: true,
    Filter: ({ column }: any) =>
      getFilter(
        column,
        'groups',
        groups.map(group => ({ title: group, value: group })),
      ),
    Cell: ({ value }: { value: Product['groups'] }) => {
      if (!value || !value.length) {
        return null;
      }

      return (
        <Flex wrap={'wrap'}>
          {value.map(group => (
            <Tag size='sm' m={1}>
              {group}
            </Tag>
          ))}
        </Flex>
      );
    },
  },
];

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
        groups: undefined,
        minCalculatedPrice: undefined,
        totalStock: undefined,
      },
    },
    {
      storage: 'session',
      storageKey: `${store ? store._id : ''}/productFilters`,
    },
  );
  const columns = React.useMemo(() => {
    return getColumns(t, storeId ?? '', groups);
  }, [storeId, groups, t]);

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
    <Flex direction='column' px={[3, 4, 5]} py={5}>
      <Flex my={3} justify='space-between'>
        <Button
          onClick={() => {
            setEditingProduct(undefined);
            setShowModal(true);
          }}
        >
          {t('actions.add')}
        </Button>
      </Flex>

      <Spinner isLoaded={!showSpinner}>
        <AdvancedTable
          data={products}
          columns={columns}
          totalData={total ?? 0}
          filtersState={filters}
          showSearch
          searchProps={{
            placeholder: `${t('actions.search')}: ${t(
              'common.name',
            ).toLowerCase()}, ${t('product.sku').toLowerCase()}, ${t(
              'common.description',
            ).toLowerCase()}`,
          }}
          onFiltersChanged={newFilters =>
            setFilters(normalizeFilters(newFilters))
          }
          onRowClick={product => {
            setEditingProduct(product);
            setShowModal(true);
          }}
        />
      </Spinner>

      <Modal
        maxWidth={['96%', '88%', '82%']}
        isOpen={showModal}
        onClose={onClose}
        header={editingProduct ? t('actions.update') : t('actions.add')}
      >
        <ProductForm product={editingProduct} onClose={onClose} />
      </Modal>
    </Flex>
  );
};
