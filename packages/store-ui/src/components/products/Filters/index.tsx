import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/fp/set';
import unset from 'lodash/fp/unset';
import React, { useState } from 'react';
import { Button, Popover, Flex } from '@sradevski/blocks-ui';
import { PriceFilter } from './PriceFilter';
import { CategoriesFilter } from './CategoriesFilter';
import { SortFilter } from './SortFilter';
import { SystemProps } from '@sradevski/blocks-ui/dist/types/system';
import { useTranslation } from '../../../common/i18n';

interface FiltersProps extends SystemProps {
  filters?: any;
  onFiltersChange: (filters: any) => void;
}

// A pretty random max price, until we have a better method to calculate it for each query.
const MAX_PRICE = 20000;
const MIN_PRICE = 0;

const parsePriceFilter = priceFilter => {
  if (!priceFilter) {
    return [0, MAX_PRICE];
  }

  // If it is an exact value, set that to be both from and to
  if (isNumber(priceFilter)) {
    return [priceFilter, priceFilter];
  }

  const fromPrice = priceFilter.$gt || priceFilter.$gte || 0;
  const toPrice = priceFilter.$lt || priceFilter.$lte || MAX_PRICE;

  return [fromPrice, toPrice];
};

const parseCategoryFilter = categoryFilter => {
  if (!categoryFilter) {
    return [];
  }

  if (isString(categoryFilter)) {
    return [categoryFilter];
  }

  return categoryFilter.$in || [];
};

const parseSortFilter = sortFilter => {
  if (!sortFilter) {
    return {};
  }

  return sortFilter.price ? { price: parseInt(sortFilter.price, 10) } : {};
};

const setFiltersCategory = (filters: any, categories: string[]) => {
  if (!categories.length) {
    return unset('query.category', filters);
  }

  if (categories.length === 1) {
    return set('query.category', categories[0], filters);
  }

  return set('query.category', { $in: categories }, filters);
};

const setFiltersPrice = (filters: any, from: number, to: number) => {
  let priceQuery: { $gte?: number; $lte?: number } = {};
  if (from === to) {
    return set('query.price', from, filters);
  }

  if (from > to) {
    return set('query.price', from, filters);
  }

  if (from > MIN_PRICE) {
    priceQuery.$gte = from;
  }

  if (to < MAX_PRICE) {
    priceQuery.$lte = to;
  }

  return set('query.price', priceQuery, filters);
};

const setFiltersSort = (filters: any, sort: { [key: string]: number }) => {
  if (isEmpty(sort)) {
    return unset('query.$sort', filters);
  }

  return set('query.$sort', sort, filters);
};

export const Filters = ({
  filters,
  onFiltersChange,
  ...otherProps
}: FiltersProps) => {
  const { t } = useTranslation();
  const [visiblePopover, setVisiblePopover] = useState<
    'categories' | 'price' | 'sort' | null
  >(null);

  // @ts-ignore
  const { category, price, $sort } =
    filters && filters.query ? filters.query : {};

  const [fromPrice, toPrice] = parsePriceFilter(price);
  const categories = parseCategoryFilter(category);
  const sort = parseSortFilter($sort);

  return (
    <Flex {...otherProps}>
      <Popover
        title={t('common.category_plural')}
        placement='bottom'
        visible={visiblePopover === 'categories'}
        content={
          <CategoriesFilter
            categories={categories}
            onChange={categories => {
              onFiltersChange(setFiltersCategory(filters, categories));
              setVisiblePopover(null);
            }}
          />
        }
        trigger='click'
      >
        <Button onClick={() => setVisiblePopover('categories')}>
          {t('common.category_plural')}
        </Button>
      </Popover>

      <Popover
        title={t('common.price')}
        placement='bottom'
        visible={visiblePopover === 'price'}
        content={
          <PriceFilter
            from={fromPrice}
            to={toPrice}
            min={MIN_PRICE}
            max={MAX_PRICE}
            onChange={(from, to) => {
              onFiltersChange(setFiltersPrice(filters, from, to));
              setVisiblePopover(null);
            }}
          />
        }
        trigger='click'
      >
        <Button mx={3} onClick={() => setVisiblePopover('price')}>
          {t('common.price')}
        </Button>
      </Popover>

      <Popover
        title={t('common.sort')}
        placement='bottom'
        visible={visiblePopover === 'sort'}
        content={
          <SortFilter
            sort={sort}
            onChange={sort => {
              onFiltersChange(setFiltersSort(filters, sort));
              setVisiblePopover(null);
            }}
          />
        }
        trigger='click'
      >
        <Button onClick={() => setVisiblePopover('sort')}>
          {t('common.sort')}
        </Button>
      </Popover>
    </Flex>
  );
};
