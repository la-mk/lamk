import isString from 'lodash/isString';
import React, { useCallback } from 'react';
import flatMap from 'lodash/flatMap';
import {
  Flex,
  Dropdown,
  Menu,
  MenuItem,
  Icon,
  Text,
  Button,
} from '@sradevski/blocks-ui';
import {
  getCategories,
  GroupedCategories,
  createGetGroupedCategories,
} from '../state/modules/categories/categories.selector';
import { useSelector } from 'react-redux';
import { useTranslation } from '../common/i18n';
import Link from 'next/link';
import queryString from 'qs';

const getQueryString = (categories: string | string[]) => {
  if (isString(categories)) {
    return queryString.stringify({ query: { category: categories } });
  }

  return queryString.stringify({ query: { category: { $in: categories } } });
};

export const CategoriesList = () => {
  const categories = useSelector(getCategories);
  const { t } = useTranslation();

  const getGroupedCategories = useCallback(() => {
    return createGetGroupedCategories((categoryKey: string) =>
      t(`categories.${categoryKey}`),
    );
  }, [t])();

  const groupedCategories: GroupedCategories = useSelector(
    getGroupedCategories,
  );

  if (!categories) {
    return null;
  }

  if (categories.length < 3) {
    return (
      <Flex flexDirection='row' justifyContent='center' mb={4}>
        {categories.map(category => {
          return (
            <Link
              href={`/products?${getQueryString(category.level3)}`}
              passHref
            >
              <Button type='link' mt={3} mx={3} key={category.level3}>
                {/* TODO: Flatten categories and use category level 3 label instead*/}
                <Text strong>{category.level3}</Text>
              </Button>
            </Link>
          );
        })}
      </Flex>
    );
  }

  const level2Categories = flatMap(groupedCategories, level1Category => {
    return level1Category.children;
  });

  if (level2Categories.length < 3) {
    return (
      <Flex flexDirection='row' justifyContent='center' mb={4}>
        {level2Categories.map(level2Category => {
          return (
            <Link
              href={`/products?${getQueryString(
                level2Category.children.map(category3 => category3.value),
              )}`}
              passHref
            >
              <Button type='link' mt={3} mx={3} key={level2Category.value}>
                <Text strong>{level2Category.label}</Text>
              </Button>
            </Link>
          );
        })}
      </Flex>
    );
  }

  return (
    <Flex flexDirection='row' justifyContent='center' mb={4}>
      {groupedCategories.map(level1Category => {
        const menu = (
          <Menu>
            {level1Category.children.map(level2Category => {
              return (
                <MenuItem key={level2Category.value}>
                  <Link
                    href={`/products?${getQueryString(
                      level2Category.children.map(category3 => category3.value),
                    )}`}
                  >
                    <a>{level2Category.label}</a>
                  </Link>
                </MenuItem>
              );
            })}
          </Menu>
        );

        return (
          <Dropdown mt={3} mx={3} key={level1Category.value} overlay={menu}>
            <Flex flexWrap='nowrap' alignItems='center'>
              <Text strong>{level1Category.label}</Text>
              <Icon ml={2} type='down' />
            </Flex>
          </Dropdown>
        );
      })}
    </Flex>
  );
};
