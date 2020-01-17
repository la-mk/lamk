import isEqual from 'lodash/isEqual';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Flex,
  Select,
  OptionGroup,
  Option,
  Button,
} from '@sradevski/blocks-ui';
import { useTranslation } from '../../../common/i18n';
import {
  createGetGroupedCategories,
  GroupedCategories,
} from '../../../state/modules/categories/categories.selector';
import { useSelector } from 'react-redux';

interface CategoriesFilterProps {
  categories: string[];
  onCancel: () => void;
  onChange: (categories: string[]) => void;
}

export const CategoriesFilter = ({
  categories,
  onCancel,
  onChange,
}: CategoriesFilterProps) => {
  const [localCategories, setLocalCategories] = useState(categories);
  const { t } = useTranslation();

  const getGroupedCategories = useCallback(() => {
    return createGetGroupedCategories((categoryKey: string) =>
      t(`categories.${categoryKey}`),
    );
  }, [t])();

  const groupedCategories: GroupedCategories = useSelector(
    getGroupedCategories,
  );

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  return (
    <Flex p={3} flexDirection='column'>
      <Select
        mode='multiple'
        width='100%'
        minWidth='240px'
        maxWidth='400px'
        showArrow
        filterOption={true}
        optionFilterProp={'data-label'}
        placeholder={t('common.selectCategory')}
        value={localCategories}
        onChange={(values: string[]) => setLocalCategories(values)}
      >
        {groupedCategories
          .flatMap(level1 => level1.children)
          .map(level2 => (
            <OptionGroup
              key={level2.value}
              label={level2.label}
              data-label={level2.label}
            >
              {level2.children.map(level3 => (
                <Option
                  key={level3.value}
                  value={level3.value}
                  data-label={level3.label}
                >
                  {level3.label}
                </Option>
              ))}
            </OptionGroup>
          ))}
      </Select>

      <Flex mt={4} justifyContent='flex-end'>
        <Button onClick={onCancel} width='100px' mr={3}>
          {t('actions.cancel')}
        </Button>
        <Button
          disabled={isEqual(categories, localCategories)}
          onClick={() => onChange(localCategories)}
          width='100px'
          type='primary'
        >
          {t('common.ok')}
        </Button>
      </Flex>
    </Flex>
  );
};
