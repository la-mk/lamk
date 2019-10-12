import React from 'react';
import flatMap from 'lodash/flatMap';
import {
  Flex,
  Dropdown,
  Menu,
  MenuItem,
  Icon,
  Text,
  Button,
} from '@lamk/blocks-ui';
import {
  getGroupedCategories,
  getCategories,
  GroupedCategories,
} from '../state/modules/categories/categories.selector';
import { useSelector } from 'react-redux';

export const CategoriesList = () => {
  const categories = useSelector(getCategories);
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
            <Button type='link' mt={3} mx={3} key={category.level3}>
              <Text strong>{category.level3}</Text>
            </Button>
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
            <Button type='link' mt={3} mx={3} key={level2Category.value}>
              <Text strong>{level2Category.label}</Text>
            </Button>
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
                  {level2Category.label}
                </MenuItem>
              );
            })}
          </Menu>
        );

        return (
          <Dropdown mt={3} mx={3} key={level1Category.value} overlay={menu}>
            <div>
              <Text strong>{level1Category.label}</Text>
              <Icon ml={2} type='down' />
            </div>
          </Dropdown>
        );
      })}
    </Flex>
  );
};
