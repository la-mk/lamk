import isString from 'lodash/isString';
import React from 'react';
import { FilterObject } from '@la-mk/blocks-ui/dist/hooks/useFilter';
import { CategoriesMenu } from '../categories/CategoriesMenu';
import { utils, Button, Text, Flex } from '@la-mk/blocks-ui';
import { useTranslation } from '../../../common/i18n';
import { CustomCard } from '../components/CustomCard';
import { ReloadOutlined } from '@ant-design/icons';

const parseCategoryFilter = (filtering: FilterObject['filtering']) => {
  if (!filtering || !filtering.category) {
    return [];
  }

  if (isString(filtering.category)) {
    return [filtering.category];
  }

  return filtering.category.$in || [];
};

interface CategoriesFilterProps {
  filters: FilterObject;
  onChange: (filters: FilterObject) => void;
}

export const CategoriesFilter = ({
  filters,
  onChange,
  ...props
}: CategoriesFilterProps & React.ComponentProps<typeof CustomCard>) => {
  const { t } = useTranslation();
  const selectedCategories = parseCategoryFilter(filters.filtering);

  const handleSelectedCategoriesChange = (selectedKeys: string[]) => {
    onChange({
      ...filters,
      // We want to clear the search when selecting a category (for now)
      searching: undefined,
      filtering: {
        ...filters.filtering,
        ...utils.filter.multipleItemsFilter('category', selectedKeys),
      },
    });
  };

  return (
    <CustomCard {...props}>
      <Flex px={3} justify='space-between' mb={4}>
        <Text>{t('common.category_plural')}</Text>
        <Button
          variant='link'
          onClick={() => handleSelectedCategoriesChange([])}
          size='sm'
          leftIcon={<ReloadOutlined />}
        >
          {t('actions.reset')}
        </Button>
      </Flex>
      <CategoriesMenu
        selectedKeys={selectedCategories}
        onSelect={handleSelectedCategoriesChange}
      />
    </CustomCard>
  );
};
