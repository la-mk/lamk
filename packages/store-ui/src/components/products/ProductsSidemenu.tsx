import React from 'react';
import { Box, Card, Title, Divider } from '@sradevski/blocks-ui';
import { CategoriesFilter } from '../shared/Filters/CategoriesFilter';
import { PriceFilter } from '../shared/Filters/PriceFilter';
import { SortFilter } from '../shared/Filters/SortFilter';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';
import { useTranslation } from '../../common/i18n';

// A pretty random max price, until we have a better method to calculate it for each query.
const MAX_PRICE = 20000;
const MIN_PRICE = 0;

interface ProductsSidemenuProps {
  filters: FilterObject;
  setFilters: (filters: FilterObject) => void;
}

export const ProductsSidemenu = ({
  filters,
  setFilters,
}: ProductsSidemenuProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Title level={3}>{t('common.category_plural')}</Title>
      <CategoriesFilter mode='inline' filters={filters} onChange={setFilters} />
      <Divider />
      <Title mb={3} level={3}>
        {t('common.price')}
      </Title>
      <PriceFilter
        filters={filters}
        max={MAX_PRICE}
        min={MIN_PRICE}
        onChange={setFilters}
      />
      <Divider />
      <Title level={3}>{t('common.sort')}</Title>
      <SortFilter filters={filters} onChange={setFilters} />
    </>
  );
};
