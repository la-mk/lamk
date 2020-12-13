import isString from 'lodash/isString';
import React from 'react';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';
import { CategoriesMenu, CategoriesMenuProps } from '../CategoriesMenu';
import { utils, Box, Button, Text, Flex } from '@sradevski/blocks-ui';
import { useTranslation } from '../../../common/i18n';
import styled from 'styled-components';
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
  mode: CategoriesMenuProps['mode'];
}

const ColoredMenuContainer = styled(Box)`
  & .ant-menu {
    background-color: ${props => props.theme.colors.background.light};
  }
`;

export const CategoriesFilter = ({
  filters,
  onChange,
  mode,
  ...props
}: CategoriesFilterProps & React.ComponentProps<typeof CustomCard>) => {
  const { t } = useTranslation();
  const selectedCategories = parseCategoryFilter(filters.filtering);

  const handleSelectedCategoriesChange = ({
    selectedKeys,
  }: {
    selectedKeys?: (string | number)[];
  }) => {
    onChange({
      ...filters,
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
          onClick={() => handleSelectedCategoriesChange({ selectedKeys: [] })}
          size='sm'
          leftIcon={<ReloadOutlined />}
        >
          {t('actions.reset')}
        </Button>
      </Flex>
      <ColoredMenuContainer>
        <CategoriesMenu
          mode={mode}
          selectedKeys={selectedCategories}
          onSelect={handleSelectedCategoriesChange}
        />
      </ColoredMenuContainer>
    </CustomCard>
  );
};
