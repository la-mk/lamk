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
import { FilterObject } from '../../shared/hooks/useFilter';

interface FiltersProps extends SystemProps {
  filters?: FilterObject;
  onFiltersChange: (filters: FilterObject) => void;
}

// A pretty random max price, until we have a better method to calculate it for each query.
const MAX_PRICE = 20000;
const MIN_PRICE = 0;

const parsePriceFilter = (filtering: FilterObject['filtering']) => {
  if (!filtering || !filtering.price) {
    return [0, MAX_PRICE];
  }

  // If it is an exact value, set that to be both from and to
  if (isNumber(filtering.price)) {
    return [filtering.price, filtering.price];
  }

  const fromPrice = filtering.price.$gt || filtering.price.$gte || 0;
  const toPrice = filtering.price.$lt || filtering.price.$lte || MAX_PRICE;

  return [fromPrice, toPrice];
};

const parseCategoryFilter = (filtering: FilterObject['filtering']) => {
  if (!filtering || !filtering.category) {
    return [];
  }

  if (isString(filtering.category)) {
    return [filtering.category];
  }

  return filtering.category.$in || [];
};

const getCategoryFiltering = (categories: string[]) => {
  if (!categories.length) {
    return { category: undefined };
  }

  if (categories.length === 1) {
    return { category: categories[0] };
  }

  return { category: { $in: categories } };
};

const getPriceFiltering = (from: number, to: number) => {
  let priceQuery: { $gte?: number; $lte?: number } = {};
  if (from === to || from > to) {
    return { price: from };
  }

  if (from > MIN_PRICE) {
    priceQuery.$gte = from;
  }

  if (to < MAX_PRICE) {
    priceQuery.$lte = to;
  }

  return { price: priceQuery };
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

  const { filtering, sorting } = filters;
  const [fromPrice, toPrice] = parsePriceFilter(filtering);
  const categories = parseCategoryFilter(filtering);

  return (
    <Flex
      {...otherProps}
      flexWrap='wrap'
      justifyContent='center'
      alignItems='center'
    >
      <Popover
        title={t('common.category_plural')}
        placement='bottom'
        visible={visiblePopover === 'categories'}
        content={
          <CategoriesFilter
            categories={categories}
            onCancel={() => setVisiblePopover(null)}
            onChange={categories => {
              onFiltersChange({
                ...filters,
                filtering: {
                  ...filtering,
                  ...getCategoryFiltering(categories),
                },
              });
              setVisiblePopover(null);
            }}
          />
        }
        trigger='click'
      >
        <Button
          mt={1}
          onClick={() =>
            setVisiblePopover(
              visiblePopover === 'categories' ? null : 'categories',
            )
          }
        >
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
            onCancel={() => setVisiblePopover(null)}
            onChange={(from, to) => {
              onFiltersChange({
                ...filters,
                filtering: {
                  ...(filtering || {}),
                  ...getPriceFiltering(from, to),
                },
              });
              setVisiblePopover(null);
            }}
          />
        }
        trigger='click'
      >
        <Button
          mt={1}
          mx={3}
          onClick={() =>
            setVisiblePopover(visiblePopover === 'price' ? null : 'price')
          }
        >
          {t('common.price')}
        </Button>
      </Popover>

      <Popover
        title={t('common.sort')}
        placement='bottom'
        visible={visiblePopover === 'sort'}
        content={
          <SortFilter
            sort={sorting}
            onCancel={() => setVisiblePopover(null)}
            onChange={sort => {
              onFiltersChange({ ...filters, sorting: sort });
              setVisiblePopover(null);
            }}
          />
        }
        trigger='click'
      >
        <Button
          mt={1}
          onClick={() =>
            setVisiblePopover(visiblePopover === 'sort' ? null : 'sort')
          }
        >
          {t('common.sort')}
        </Button>
      </Popover>
    </Flex>
  );
};
